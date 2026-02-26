import { NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  imports: [NgClass],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  readonly formInput = input<FormControl>();

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
    this.formInput()?.setValue(null);
  }

  private handleFile(file: File | null) {
    if (!file) {
      return;
    }
    this.selectedFile.set(
      URL.createObjectURL(new Blob([file], { type: file?.type })),
    );
    this.formInput()?.setValue(file);
  }
}
