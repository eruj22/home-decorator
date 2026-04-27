import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, provideRouter, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const isAuthenticatedSignal = signal(false);

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => AuthGuard(...guardParameters));

  beforeEach(() => {
    isAuthenticatedSignal.set(false);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { isAuthenticated: isAuthenticatedSignal },
        },
      ],
    });
  });

  it('should allow navigation when the user is authenticated', () => {
    isAuthenticatedSignal.set(true);

    expect(executeGuard({} as any, {} as any)).toBe(true);
  });

  it('should redirect to /login when the user is not authenticated', () => {
    const result = executeGuard({} as any, {} as any);

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe(
      '/login',
    );
  });
});
