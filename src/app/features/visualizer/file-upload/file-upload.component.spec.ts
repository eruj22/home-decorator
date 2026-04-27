import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { FileUploadComponent } from './file-upload.component';

const createFile = (name: string, size: number, type: string) => {
  const file = new File(['a'.repeat(size)], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('FileUploadComponent', () => {
  it('should correctly render', async () => {
    await render(FileUploadComponent);

    expect(screen.getByText(/Drag and drop image here/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Select file/i })).toBeDefined();
  });

  it('should show image preview after selecting a valid image', async () => {
    await render(FileUploadComponent);

    await userEvent.upload(
      screen.getByTestId('file-input'),
      createFile('test.png', 1000, 'image/png'),
    );

    expect(screen.getByAltText('Selected file preview')).toBeDefined();
  });

  it('should show error for file too big', async () => {
    await render(FileUploadComponent);

    await userEvent.upload(
      screen.getByTestId('file-input'),
      createFile('big.png', 11 * 1024 * 1024, 'image/png'),
    );

    expect(screen.getByText(/File is too big/i)).toBeDefined();
  });

  it('should clear selected file when clear button is clicked', async () => {
    await render(FileUploadComponent);

    await userEvent.upload(
      screen.getByTestId('file-input'),
      createFile('test.png', 1000, 'image/png'),
    );

    expect(screen.getByAltText('Selected file preview')).toBeDefined();

    await userEvent.click(screen.getByRole('button', { name: /x/i }));

    expect(screen.queryByAltText('Selected file preview')).toBeNull();
  });

  it('should handle drag and drop file upload', async () => {
    class MockDataTransfer {
      files: File[] = [];
      items = {
        add: (file: File) => {
          this.files.push(file);
        },
      };
    }
    (globalThis as any).DataTransfer = MockDataTransfer;

    await render(FileUploadComponent);
    const data = new MockDataTransfer();
    data.items.add(createFile('drag.png', 1000, 'image/png'));

    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', { value: data });
    screen.getByText(/Drag and drop image here/i).dispatchEvent(dropEvent);

    expect(await screen.findByAltText('Selected file preview')).toBeDefined();
  });

  it('should show error for invalid file type on drag and drop', async () => {
    class MockDataTransfer {
      files: File[] = [];
      items = {
        add: (file: File) => {
          this.files.push(file);
        },
      };
    }
    (globalThis as any).DataTransfer = MockDataTransfer;

    await render(FileUploadComponent);
    const data = new MockDataTransfer();
    data.items.add(createFile('drag.txt', 1000, 'text/plain'));

    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', { value: data });
    screen.getByText(/Drag and drop image here/i).dispatchEvent(dropEvent);

    expect(
      await screen.findByText(/Invalid file type. Please upload an image./i),
    ).toBeDefined();
  });
});
