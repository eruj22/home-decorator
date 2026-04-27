import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { of, Subject, throwError } from 'rxjs';
import { vi } from 'vitest';
import { FileUploadApiService } from '../../../core/file-upload-api.service';
import { GeneratedImage } from '../../../core/models/image-upload.model';
import { ImageDialogComponent } from './image-dialog.component';

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
    selectedImage?: GeneratedImage | null;
    deleteImageImpl?: () => any;
  } = {},
) => {
  const { selectedImage = mockImage, deleteImageImpl = () => of(null) } =
    options;

  const deleteImageSpy = vi.fn().mockImplementation(deleteImageImpl);

  const result = await render(ImageDialogComponent, {
    componentInputs: { selectedImage },
    providers: [
      {
        provide: FileUploadApiService,
        useValue: { deleteImage: deleteImageSpy },
      },
    ],
  });

  result.detectChanges();

  return { ...result, deleteImageSpy };
};

describe('ImageDialogComponent', () => {
  it('should display the selected image metadata', async () => {
    await setup();

    expect(screen.getByText(mockImage.roomType)).toBeDefined();
    expect(screen.getByText(mockImage.styleType)).toBeDefined();
    expect(screen.getByText(mockImage.lightingCondition)).toBeDefined();
    const expectedAlt = `Generated design for ${mockImage.roomType} in ${mockImage.styleType} style with ${mockImage.lightingCondition} lighting`;
    expect(screen.getByAltText(expectedAlt)).toBeDefined();
  });

  it('should not render the image when selectedImage is null', async () => {
    await setup({ selectedImage: null });

    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.queryByText(mockImage.styleType)).toBeNull();
    expect(screen.queryByText(mockImage.roomType)).toBeNull();
  });

  it('should display nothing when no image is selected', async () => {
    const { deleteImageSpy } = await setup();
    const [, confirmDeleteBtn] = screen.getAllByRole('button', {
      name: 'Delete',
      hidden: true,
    });
    await userEvent.click(confirmDeleteBtn);
    expect(deleteImageSpy).toHaveBeenCalledWith(mockImage.id);
    expect(
      screen.getByText('Are you sure you want to delete this image?'),
    ).toBeDefined();
  });

  it('should disable the confirm button and show a loading spinner while deletion is in progress', async () => {
    const deleteSubject = new Subject<void>();
    const { detectChanges } = await setup({
      deleteImageImpl: () => deleteSubject.asObservable(),
    });
    const [, confirmDeleteBtn] = screen.getAllByRole('button', {
      name: 'Delete',
      hidden: true,
    });
    await userEvent.click(confirmDeleteBtn);
    detectChanges();
    expect(confirmDeleteBtn.hasAttribute('disabled')).toBe(true);
    expect(confirmDeleteBtn.querySelector('.loading-spinner')).not.toBeNull();
  });

  it('should show an error message when deletion fails', async () => {
    const { detectChanges } = await setup({
      deleteImageImpl: () => throwError(() => new Error('Server error')),
    });
    const [, confirmDeleteBtn] = screen.getAllByRole('button', {
      name: 'Delete',
      hidden: true,
    });
    await userEvent.click(confirmDeleteBtn);
    detectChanges();
    expect(
      screen.getByText(/An error occurred while deleting the image/),
    ).toBeDefined();
  });
});
