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
  readonly createdImage = signal<string | null>(null);
  readonly state = signal<'idle' | 'loading' | 'error'>('idle');

  uploadFile() {
    const selectedFile = this.selectedFile();
    if (!selectedFile) {
      return;
    }
    this.state.set('loading');
    this.fileUploadApiService
      .uploadFile(selectedFile)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.createdImage.set(response.imageUrl ?? null);
          this.state.set('idle');
        },
        error: () => {
          this.state.set('error');
        },
      });
  }
}
