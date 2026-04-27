import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AuthService } from '../../../core/auth.service';
import { NavbarComponent } from './navbar.component';

const setup = async (options: { isAuthenticated?: boolean } = {}) => {
  const { isAuthenticated = false } = options;
  const logoutSpy = vi.fn();

  const result = await render(NavbarComponent, {
    providers: [
      provideRouter([]),
      {
        provide: AuthService,
        useValue: {
          isAuthenticated: signal(isAuthenticated),
          logout: logoutSpy,
        },
      },
    ],
  });
  result.detectChanges();

  return { ...result, logoutSpy };
};

describe('NavbarComponent', () => {
  it('should render the site title', async () => {
    await setup();

    expect(screen.getByText(/home decorator/i)).toBeDefined();
  });

  it('should show a login link when the user is not authenticated', async () => {
    await setup({ isAuthenticated: false });

    expect(screen.getByRole('link', { name: /login/i })).toBeDefined();
    expect(screen.queryByRole('link', { name: /visualizer/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /logout/i })).toBeNull();
  });

  it('should show visualizer link and logout button when authenticated', async () => {
    await setup({ isAuthenticated: true });

    expect(screen.getByRole('link', { name: /visualizer/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /logout/i })).toBeDefined();
    expect(screen.queryByRole('link', { name: /login/i })).toBeNull();
  });

  it('should call authService.logout when the logout button is clicked', async () => {
    const { logoutSpy } = await setup({ isAuthenticated: true });

    await userEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });
});
