import { provideRouter, Router } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { UserApiService } from '../../core/user-api.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from './register.component';

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  initializeAuth: vi.fn(() => ({})),
}));

const mockUserApiService = {
  createProfile: vi.fn().mockReturnValue(of(null)),
};

const setup = async () => {
  const result = await render(RegisterComponent, {
    providers: [
      provideRouter([{ path: 'login', component: LoginComponent }]),
      { provide: UserApiService, useValue: mockUserApiService },
    ],
  });
  result.detectChanges();
  return result;
};

describe('RegisterComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserApiService.createProfile.mockReturnValue(of(null));
  });

  it('should render the registration form', async () => {
    await setup();

    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /register/i })).toBeDefined();
  });

  it('should not call firebase when form fields are empty', async () => {
    await setup();

    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('should show a loading spinner while registration is in progress', async () => {
    (
      createUserWithEmailAndPassword as ReturnType<typeof vi.fn>
    ).mockReturnValueOnce(new Promise(() => {}));

    const { detectChanges } = await setup();
    await userEvent.type(screen.getByLabelText(/email/i), 'new@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));
    detectChanges();

    expect(screen.getByText(/loading/i)).toBeDefined();
  });

  it('should show an error message on failed registration', async () => {
    (
      createUserWithEmailAndPassword as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(
      new Error('Firebase: Error (auth/email-already-in-use).'),
    );

    await setup();
    await userEvent.type(
      screen.getByLabelText(/email/i),
      'existing@example.com',
    );
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(
      await screen.findByText(/The email address is already in use/i),
    ).toBeDefined();
  });

  it('should have a link to the login page', async () => {
    const { fixture } = await setup();
    const router = fixture.debugElement.injector.get(Router);
    await userEvent.click(screen.getByRole('link', { name: /login/i }));

    expect(router.url).toBe('/login');

    // expect(screen.getByRole('link', { name: /login/i })).toBeDefined();
  });
});
