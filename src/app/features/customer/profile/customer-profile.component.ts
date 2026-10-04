import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-profile.component.html'
})
export class CustomerProfileComponent {
  private readonly authService = inject(AuthService);

  get currentUser() {
    return this.authService.getCurrentUser();
  }
}
