import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadApiService {
  private readonly http = inject(HttpClient);

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(
      `${environment.backendEndpoint}/api/v1/upload`,
      formData,
    );
  }
}
