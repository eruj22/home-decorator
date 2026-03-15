import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  GeneratedImage,
  UploadImagePayload,
} from './models/image-upload.model';

@Injectable({
  providedIn: 'root',
})
export class FileUploadApiService {
  private readonly http = inject(HttpClient);

  uploadImage(payload: UploadImagePayload) {
    const formData = new FormData();
    formData.append('image', payload.image);
    formData.append('roomType', payload.roomType);
    formData.append('styleType', payload.styleType);
    formData.append('lightingCondition', payload.lightingCondition);

    return this.http.post<GeneratedImage>(
      `${environment.backendEndpoint}/api/v1/images`,
      formData,
    );
  }
}
