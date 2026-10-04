import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { RegisterRequest } from '../../../core/auth/auth.models';
import { Role } from '../../../core/enums/insurance.enums';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordMatchValidator }
  );

  submitting = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const route = this.authService.getDashboardRouteForRole(this.authService.getRole());
      this.router.navigateByUrl(route);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Please complete all required fields correctly.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: RegisterRequest = {
      fullName: this.form.controls.fullName.value,
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      role: Role.User
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Registration successful. Redirecting to sign in...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 800);
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'Unable to create your account. Please try again.';
      }
    });
  }
}
