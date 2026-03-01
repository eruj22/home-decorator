import { NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@Component({
  selector: 'app-file-upload',
  imports: [NgClass],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  readonly formInput = input<FormControl>();

  readonly selectedFile = signal<string | null>(null);
  readonly errorState = signal<'tooBig' | 'invalidType' | null>(null);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files ? input.files[0] : null;
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
    if (!file.type.startsWith('image/')) {
      this.errorState.set('invalidType');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      this.errorState.set('tooBig');
      return;
    }
    this.errorState.set(null);
    this.selectedFile.set(
      URL.createObjectURL(new Blob([file], { type: file?.type })),
    );
    this.formInput()?.setValue(file);
  }
}
