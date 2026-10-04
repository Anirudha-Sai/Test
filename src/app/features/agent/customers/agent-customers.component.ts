import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-agent-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './agent-customers.component.html'
})
export class AgentCustomersComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  customers: Customer[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  ngOnInit(): void {
    this.loadCustomers();
  }

  get filteredCustomers(): Customer[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.customers;
    }

    return this.customers.filter((customer) => {
      const userName = this.getCustomerUserName(customer).toLowerCase();
      const customerId = String(customer.customerId ?? '').toLowerCase();
      return userName.includes(term) || customerId.includes(term);
    });
  }

  trackCustomer(index: number, customer: Customer): number | string {
    return customer.customerId ?? index;
  }

  getCustomerUserName(customer: Customer): string {
    if (customer.user?.fullName) {
      return customer.user.fullName;
    }

    return customer.userName || customer.user?.email || 'Unknown user';
  }

  getCustomerSince(customer: Customer): string {
    return customer.customerSince || customer.createdAt || '—';
  }

  isCustomerActive(customer: Customer): boolean {
    console.log('Customer:', customer);
    if (typeof customer.active === 'boolean') {
      return customer.active;
    }

    const status = String(customer.status ?? '').toLowerCase();
    return status === 'active' || status === 'enabled';
  }

  openCustomer(customer: Customer): void {
    if (customer.customerId == null) {
      return;
    }

    this.router.navigate(['/agent/customers', customer.customerId]);
  }

  openCustomerAssets(customer: Customer): void {
    if (customer.customerId == null) {
      return;
    }

    this.router.navigate(['/agent/customers', customer.customerId, 'assets']);
  }

  private loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load customers.';
        this.isLoading = false;
      }
    });
  }
}
