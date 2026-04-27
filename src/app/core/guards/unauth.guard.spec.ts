import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth.service';
import { UnauthGuard } from './unauth.guard';

describe('UnauthGuard', () => {
  const isAuthenticatedSignal = signal(false);

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => UnauthGuard(...guardParameters));

  beforeEach(() => {
    isAuthenticatedSignal.set(false);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: { isAuthenticated: isAuthenticatedSignal },
        },
      ],
    });
  });

  it('should allow navigation when the user is not authenticated', () => {
    expect(executeGuard({} as any, {} as any)).toBe(true);
  });

  it('should deny navigation when the user is authenticated', () => {
    isAuthenticatedSignal.set(true);

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/');
  });
});
