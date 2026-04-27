import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { from, switchMap, tap } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { auth } from '../../core/libs/firebase';
import { UserApiService } from '../../core/user-api.service';
import { getFirebaseErrorMessage } from '../../core/utils/firebase-errors';
import { metaDescriptions } from '../../core/utils/meta-descriptions';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly userApiService = inject(UserApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly registerForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    metaDescriptions('register');

    this.destroyRef.onDestroy(() => {
      this.isLoading.set(false);
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    this.isLoading.set(true);

    const email = this.registerForm.value.email ?? '';
    const password = this.registerForm.value.password ?? '';

    from(createUserWithEmailAndPassword(auth, email, password))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((userCredential) => from(userCredential.user.getIdToken())),
        tap((idToken) => this.authService.setAuthToken(idToken)),
        switchMap(() => this.userApiService.createProfile()),
      )
      .subscribe({
        next: () => {
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
