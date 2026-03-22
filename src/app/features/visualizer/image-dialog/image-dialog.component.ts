import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { delay, take, tap } from 'rxjs';
import { FileUploadApiService } from '../../../core/file-upload-api.service';
import { GeneratedImage } from '../../../core/models/image-upload.model';

@Component({
  selector: 'app-image-dialog',
  imports: [NgOptimizedImage],
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.scss',
})
export class ImageDialogComponent {
  private readonly fileUploadApiService = inject(FileUploadApiService);

  readonly imageDialog =
    viewChild<ElementRef<HTMLDialogElement>>('imageDialog');
  readonly deleteImageDialog =
    viewChild<ElementRef<HTMLDialogElement>>('deleteImageDialog');

  readonly selectedImage = input<GeneratedImage | null>(null);
  readonly deletedImage = output<string>();

  readonly state = signal<'idle' | 'loading' | 'error'>('idle');

  showModal() {
    this.imageDialog()?.nativeElement.showModal();
  }

  deleteImage() {
    const imageToDelete = this.selectedImage();
    if (!imageToDelete) {
      return;
    }
    this.state.set('loading');
    this.fileUploadApiService
      .deleteImage(imageToDelete.id)
      .pipe(
        take(1),
        tap(() => {
          this.deletedImage.emit(imageToDelete.id);

          this.imageDialog()?.nativeElement.close();
          this.deleteImageDialog()?.nativeElement.close();
        }),
        delay(500),
      )
      .subscribe({
        next: () => {
          this.state.set('idle');
        },
        error: () => {
          this.state.set('error');
        },
      });
  }

  closeDeleteImageDialog() {
    this.state.set('idle');
  }
}
