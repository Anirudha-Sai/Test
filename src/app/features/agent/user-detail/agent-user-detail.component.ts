import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Role } from '../../../core/enums/insurance.enums';
import { User } from '../../../core/models/user.model';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-agent-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-user-detail.component.html'
})
export class AgentUserDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly customerService = inject(CustomerService);
  private readonly toastService = inject(ToastService);

  user: User | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'User was not found.';
      return;
    }

    this.loadUser(id);
  }

  get fullName(): string {
    if (!this.user) {
      return 'User';
    }

    return this.user.fullName || [this.user.firstName, this.user.lastName].filter(Boolean).join(' ') || 'Unknown user';
  }

  isCustomerUser(): boolean {
    if (!this.user) {
      return false;
    }

    const role = String(this.user.role?.[1] ?? '').toLowerCase();
    const status = String(this.user.status ?? this.user.accountStatus ?? '').toLowerCase();
    return role === Role.Customer.toLowerCase() || status === 'customer';
  }

  convertToCustomer(): void {
    if (!this.user?.userId) {
      return;
    }

    if (this.isCustomerUser()) {
      this.toastService.showInfo('This user already has a customer account.');
      return;
    }

    const confirmed = window.confirm('Convert User to Customer?\n\nThis will create a customer profile for this user.');
    if (!confirmed) {
      return;
    }

    this.customerService.createCustomer(String(this.user.userId)).subscribe({
      next: (customer) => {
        this.toastService.showSuccess('Customer profile created successfully.');
        if (customer.customerId != null) {
          this.router.navigate(['/agent/customers', customer.customerId]);
        } else {
          this.router.navigate(['/agent/customers']);
        }
      },
      error: () => {
        this.toastService.showError('Unable to convert this user to a customer.');
      }
    });
  }

  private loadUser(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load this user.';
        this.isLoading = false;
      }
    });
  }
}
