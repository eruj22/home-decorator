import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
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

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow navigation when the user is not authenticated', () => {
    expect(executeGuard({} as any, {} as any)).toBe(true);
  });

  it('should deny navigation when the user is authenticated', () => {
    isAuthenticatedSignal.set(true);

    expect(executeGuard({} as any, {} as any)).toBe(false);
  });
});
