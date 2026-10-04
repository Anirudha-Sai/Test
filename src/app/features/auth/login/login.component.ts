import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { LoginRequest } from '../../../core/auth/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submitting = false;
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
      this.errorMessage = 'Please enter a valid email and password.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const payload: LoginRequest = this.form.getRawValue();
    this.authService.login(payload).subscribe({
      next: () => {
        const role = this.authService.getRole();
        const nextRoute = this.authService.getDashboardRouteForRole(role);
        this.router.navigateByUrl(nextRoute);
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'Unable to sign in. Please check your credentials and try again.';
      }
    });
  }
}
