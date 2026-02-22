import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  readonly fileChange = output<File>();

  readonly selectedFile = signal<File | null>(null);

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.handleFile(file);
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();

    const file: File | null = event.dataTransfer?.files[0] ?? null;
    this.selectedFile.set(file);
    this.handleFile(file);
  }

  private handleFile(file: File | null) {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    this.fileChange.emit(file);
  }
}
