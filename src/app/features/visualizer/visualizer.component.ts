import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, of, take } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { FileUploadApiService } from '../../core/file-upload-api.service';
import {
  GeneratedImage,
  UploadImagePayload,
} from '../../core/models/image-upload.model';
import { UserApiService } from '../../core/user-api.service';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import {
  LIGHTING_CONDITIONS,
  ROOM_TYPES,
  STYLE_TYPES,
} from './visualizer-select-data';

interface VisualizerForm {
  image: FormControl<File | null>;
  roomType: FormControl<string | null>;
  styleType: FormControl<string | null>;
  lightingCondition: FormControl<string | null>;
}

@Component({
  selector: 'app-visualizer',
  imports: [FileUploadComponent, ReactiveFormsModule, ImageDialogComponent],
  templateUrl: './visualizer.component.html',
  styleUrl: './visualizer.component.scss',
})
export class VisualizerComponent {
  private readonly fileUploadApiService = inject(FileUploadApiService);
  private readonly userApiService = inject(UserApiService);
  private readonly authService = inject(AuthService);

  readonly selectedImage = signal<GeneratedImage | null>(null);
  readonly displayedImages = signal<GeneratedImage[]>([]);
  readonly uploadImageState = signal<'idle' | 'loading' | 'error' | 'invalid'>(
    'idle',
  );
  readonly uploadImageErrorMessage = signal<string | null>(null);

  readonly ROOM_TYPES = ROOM_TYPES;
  readonly STYLE_TYPES = STYLE_TYPES;
  readonly LIGHTING_CONDITIONS = LIGHTING_CONDITIONS;

  readonly visualizerForm = new FormGroup<VisualizerForm>({
    image: new FormControl(null, [Validators.required]),
    roomType: new FormControl(null, [Validators.required]),
    styleType: new FormControl(null, [Validators.required]),
    lightingCondition: new FormControl(LIGHTING_CONDITIONS[0].value, [
      Validators.required,
    ]),
  });

  readonly generatedImages = toSignal(
    this.userApiService.getGeneratedImages().pipe(
      catchError(() =>
        of({
          images: [],
          error: true,
        }),
      ),
    ),
  );

  readonly generatedImageState = computed<'idle' | 'loading' | 'error'>(() => {
    const generatedImages = this.generatedImages();
    if (generatedImages && 'error' in generatedImages) {
      return 'error';
    }
    if (generatedImages === undefined) {
      return 'loading';
    }
    return 'idle';
  });

  constructor() {
    effect(() => {
      const generatedImages = this.generatedImages();
      if (generatedImages) {
        this.displayedImages.set(generatedImages.images);
      }
    });
  }

  uploadImage() {
    if (this.visualizerForm.invalid) {
      this.uploadImageState.set('invalid');
      return;
    }
    this.uploadImageState.set('loading');

    const formValue: UploadImagePayload = {
      image: this.visualizerForm.controls.image.value!,
      roomType: this.visualizerForm.controls.roomType.value!,
      styleType: this.visualizerForm.controls.styleType.value!,
      lightingCondition: this.visualizerForm.controls.lightingCondition.value!,
    };
    this.fileUploadApiService
      .uploadImage(formValue)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.displayedImages.update((images) => [...images, response]);
          this.uploadImageState.set('idle');
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout('/login');
            return;
          }
          this.uploadImageState.set('error');
          this.uploadImageErrorMessage.set(error.error.message);
        },
      });
  }

  onImageDelete(imageId: string) {
    this.displayedImages.update((images) =>
      images.filter((image) => image.id !== imageId),
    );
    this.selectedImage.set(null);
  }
}
