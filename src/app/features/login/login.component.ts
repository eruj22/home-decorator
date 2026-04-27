import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { auth } from '../../core/libs/firebase';
import { getFirebaseErrorMessage } from '../../core/utils/firebase-errors';
import { metaDescriptions } from '../../core/utils/meta-descriptions';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly loginForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    metaDescriptions('login');

    this.destroyRef.onDestroy(() => {
      this.isLoading.set(false);
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.isLoading.set(true);
    from(signInWithEmailAndPassword(auth, email, password))
      .pipe(
        switchMap((userCredential) => from(userCredential.user.getIdToken())),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (idToken) => {
          this.authService.setAuthToken(idToken);
          this.router.navigateByUrl('/visualizer');
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            getFirebaseErrorMessage(error.message) ??
              'An unexpected error occurred. Please try again.',
          );
        },
      });
  }
}
