import { Component, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import { FileUploadApiService } from '../../core/file-upload-api.service';
import { FileUploadComponent } from './file-upload/file-upload.component';

@Component({
  selector: 'app-visualizer',
  imports: [FileUploadComponent],
  templateUrl: './visualizer.component.html',
  styleUrl: './visualizer.component.scss',
})
export class VisualizerComponent {
  private readonly fileUploadApiService = inject(FileUploadApiService);

  readonly selectedFile = signal<File | null>(null);

  uploadFile() {
    const selectedFile = this.selectedFile();
    if (!selectedFile) {
      return;
    }

    this.fileUploadApiService
      .uploadFile(selectedFile)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          console.log('File uploaded successfully', response);
        },
        error: (error) => {
          console.error('Error uploading file', error);
        },
      });
  }
}
