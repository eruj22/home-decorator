import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { from, switchMap, take } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { auth } from '../../core/libs/firebase';
import { getFirebaseErrorMessage } from '../../core/utils/firebase-errors';

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
  private readonly router = inject(Router);
  private readonly fb = new FormBuilder();
  readonly registerForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    this.isLoading.set(true);

    const email = this.registerForm.value.email ?? '';
    const password = this.registerForm.value.password ?? '';

    from(createUserWithEmailAndPassword(auth, email, password))
      .pipe(
        switchMap((userCredential) => from(userCredential.user.getIdToken())),
        take(1),
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

    this.destroyRef.onDestroy(() => {
      this.isLoading.set(false);
    });
  }
}
