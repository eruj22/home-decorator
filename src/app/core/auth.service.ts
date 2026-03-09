import { computed, inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { COOKIE_AUTH } from './utils/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly authToken = signal<string | null>(null);
  readonly isAuthenticated = computed(() => !!this.authToken());

  private readonly cookieService = inject(CookieService);

  constructor() {
    const token = this.cookieService.get(COOKIE_AUTH);
    if (token) {
      this.authToken.set(token);
    }
  }

  setAuthToken(token: string) {
    this.cookieService.set(COOKIE_AUTH, token, {
      path: '/',
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
    this.authToken.set(token);
  }

  clearAuthToken() {
    this.cookieService.delete(COOKIE_AUTH, '/');
    this.authToken.set(null);
  }
}
