import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  readonly fileChange = output<File | null>();

  readonly selectedFile = signal<string | null>(null);

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.handleFile(file);
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();

    const file: File | null = event.dataTransfer?.files[0] ?? null;
    this.handleFile(file);
  }

  clearSelectedFile() {
    this.selectedFile.set(null);
    this.fileChange.emit(null);
  }

  private handleFile(file: File | null) {
    if (!file) {
      return;
    }
    this.selectedFile.set(
      URL.createObjectURL(new Blob([file], { type: file?.type })),
    );
    this.fileChange.emit(file);
  }
}
