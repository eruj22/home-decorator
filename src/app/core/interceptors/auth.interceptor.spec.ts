import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  const authTokenSignal = signal<string | null>(null);
  let httpClient: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { authToken: authTokenSignal } },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should pass through a request without an Authorization header when no token is present', () => {
    authTokenSignal.set(null);

    httpClient.get('/api/test').subscribe();

    const req = httpController.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should add a Bearer Authorization header when an auth token is present', () => {
    authTokenSignal.set('test-auth-token');

    httpClient.get('/api/test').subscribe();

    const req = httpController.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer test-auth-token',
    );
    req.flush({});
  });

  it('should not modify request headers other than Authorization', () => {
    authTokenSignal.set('my-token');

    httpClient
      .get('/api/test', { headers: { 'X-Custom-Header': 'custom-value' } })
      .subscribe();

    const req = httpController.expectOne('/api/test');
    expect(req.request.headers.get('X-Custom-Header')).toBe('custom-value');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-token');
    req.flush({});
  });
});
