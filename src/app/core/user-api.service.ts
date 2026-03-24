import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GenerateImageResponse } from './models/image-upload.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly http = inject(HttpClient);

  getGeneratedImages() {
    return this.http.get<GenerateImageResponse>(
      `${environment.backendEndpoint}/api/v1/user/images`,
    );
  }
}
