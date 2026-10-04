import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Role } from '../../../core/enums/insurance.enums';
import { User } from '../../../core/models/user.model';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-agent-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './agent-users.component.html'
})
export class AgentUsersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly customerService = inject(CustomerService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  get filteredUsers(): User[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.users;
    }

    return this.users.filter((user) => {
      const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''} ${user.fullName ?? ''}`.toLowerCase();
      return (
        fullName.includes(term) ||
        (user.email ?? '').toLowerCase().includes(term) ||
        (user.phoneNumber ?? '').toLowerCase().includes(term)
      );
    });
  }

  getUserDisplayName(user: User): string {
    if (user.fullName) {
      return user.fullName;
    }

    const first = user.firstName ?? '';
    const last = user.lastName ?? '';
    return [first, last].filter(Boolean).join(' ') || 'Unknown user';
  }

  isCustomerUser(user: User): boolean {
    const role = String(user.role?.[1] ?? '').toLowerCase();
    const status = String(user.status ?? user.accountStatus ?? '').toLowerCase();
    return role === Role.Customer.toLowerCase() || status === 'customer';
  }

  openUser(user: User): void {
    if (user.userId == null) {
      return;
    }

    this.router.navigate(['/agent/users', user.userId]);
  }

  trackUser(index: number, user: User): number | string {
    return user.userId ?? index;
  }

  convertToCustomer(user: User): void {
    if (user.userId == null || this.isCustomerUser(user)) {
      if (this.isCustomerUser(user)) {
        this.toastService.showInfo('This user is already linked to a customer profile.');
      }
      return;
    }

    const confirmed = window.confirm('Convert User to Customer?\n\nThis will create a customer profile for this user.');
    if (!confirmed) {
      return;
    }

    this.customerService.createCustomer(String(user.userId)).subscribe({
      next: (customer) => {
        this.toastService.showSuccess('Customer profile created successfully.');
        this.loadUsers();

        if (customer.customerId != null) {
          this.router.navigate(['/agent/customers', customer.customerId]);
        } else {
          this.router.navigate(['/agent/customers']);
        }
      },
      error: () => {
        this.toastService.showError('Unable to convert the user to a customer.');
      }
    });
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load users.';
        this.isLoading = false;
      }
    });
  }
}
