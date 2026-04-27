import { provideRouter, Router } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { vi } from 'vitest';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from './login.component';

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  initializeAuth: vi.fn(() => ({})),
}));

const setup = async () => {
  const result = await render(LoginComponent, {
    providers: [
      provideRouter([{ path: 'register', component: RegisterComponent }]),
    ],
  });
  result.detectChanges();
  return result;
};

describe('LoginComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the login form', async () => {
    await setup();

    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /login/i })).toBeDefined();
  });

  it('should not call firebase when form fields are empty', async () => {
    await setup();

    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('should show a loading spinner while login is in progress', async () => {
    (
      signInWithEmailAndPassword as ReturnType<typeof vi.fn>
    ).mockReturnValueOnce(new Promise(() => {}));

    const { detectChanges } = await setup();
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    detectChanges();

    expect(screen.getByText(/loading/i)).toBeDefined();
    expect(
      screen.getByRole('button', { name: /loading/i }).hasAttribute('disabled'),
    ).toBe(true);
  });

  it('should show an error message on failed login', async () => {
    (
      signInWithEmailAndPassword as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(
      new Error('Firebase: Error (auth/invalid-credential).'),
    );

    await setup();
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(
      await screen.findByText(/The provided email or password is invalid/i),
    ).toBeDefined();
  });

  it('should have a link to the register page', async () => {
    const { fixture } = await setup();
    const router = fixture.debugElement.injector.get(Router);
    await userEvent.click(screen.getByRole('link', { name: /register/i }));

    expect(router.url).toBe('/register');
  });
});
