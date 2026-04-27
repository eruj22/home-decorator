import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event/dist/cjs/setup/index.js';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { FileUploadApiService } from '../../core/file-upload-api.service';
import { GeneratedImage } from '../../core/models/image-upload.model';
import { UserApiService } from '../../core/user-api.service';
import { VisualizerComponent } from './visualizer.component';

const mockImage: GeneratedImage = {
  id: 'img-123',
  generatedImageUrl: 'https://example.com/generated.jpg',
  roomType: 'Living Room',
  styleType: 'Modern',
  lightingCondition: 'natural',
  createdAt: '2026-04-19T00:00:00.000Z',
  size: { width: 1200, height: 800 },
};

const setup = async (
  options: {
    uploadImageImpl?: () => any;
    getGeneratedImagesImpl?: () => any;
  } = {},
) => {
  const {
    uploadImageImpl = () => of(null),
    getGeneratedImagesImpl = () => of({ images: [] }),
  } = options;

  const uploadImageSpy = vi.fn().mockImplementation(uploadImageImpl);
  const getGeneratedImagesSpy = vi
    .fn()
    .mockImplementation(getGeneratedImagesImpl);

  const result = await render(VisualizerComponent, {
    providers: [
      {
        provide: FileUploadApiService,
        useValue: { uploadImage: uploadImageSpy },
      },
      {
        provide: UserApiService,
        useValue: {
          getGeneratedImages: getGeneratedImagesSpy,
          getProfile: () =>
            of({
              availableImagesCount: 5,
            }),
        },
      },
    ],
  });

  result.detectChanges();

  return { ...result, uploadImageSpy, getGeneratedImagesSpy };
};

describe('VisualizerComponent', () => {
  it('should display error message when not all fields are filled', async () => {
    await setup();

    await userEvent.click(screen.getByRole('button', { name: /Visualize/i }));

    expect(
      screen.getByText(/Please fill in all required fields./i),
    ).toBeDefined();
  });

  it('should upload a new file', async () => {
    const image = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });
    const { uploadImageSpy } = await setup();
    await userEvent.upload(screen.getByTestId('file-input'), image);
    await userEvent.selectOptions(
      screen.getByLabelText(/Room type/i),
      'Living room',
    );
    await userEvent.selectOptions(
      screen.getByLabelText(/Room style/i),
      'Minimalist',
    );
    await userEvent.click(screen.getByRole('button', { name: /Visualize/i }));

    expect(uploadImageSpy).toHaveBeenCalledWith({
      image,
      lightingCondition: 'daylight',
      roomType: 'Living room',
      styleType: 'Minimalist',
    });
  });

  it('should display user images', async () => {
    await setup({
      getGeneratedImagesImpl: () => of({ images: [mockImage, mockImage] }),
    });

    expect(screen.getAllByRole('img').length).toBe(2);
  });

  it('should not display any images for newly created user', async () => {
    await setup({
      getGeneratedImagesImpl: () => of({ images: [] }),
    });

    expect(screen.queryByRole('img')).toBeNull();
    expect(
      screen.getByText(
        /No images to display. Please upload an image and visualize your room./i,
      ),
    ).toBeDefined();
  });

  it('should not display images when there is a network error', async () => {
    await setup({
      getGeneratedImagesImpl: () =>
        throwError(() => new Error('Network error')),
    });

    expect(screen.queryByRole('img')).toBeNull();
    expect(
      screen.getByText(
        /An error occurred while generating images. Please try again or contact support if the issue persists./i,
      ),
    ).toBeDefined();
  });
});
