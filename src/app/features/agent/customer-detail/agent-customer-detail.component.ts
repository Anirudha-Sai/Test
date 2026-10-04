import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Asset } from '../../../core/models/asset.model';
import { Customer } from '../../../core/models/customer.model';
import { AssetService } from '../../../core/services/asset.service';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-agent-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-customer-detail.component.html'
})
export class AgentCustomerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);
  private readonly assetService = inject(AssetService);

  customer: Customer | null = null;
  customerAssets: Asset[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Customer was not found.';
      return;
    }

    this.loadCustomer(id);
  }

  get userDisplayName(): string {
    if (!this.customer) {
      return 'Customer';
    }

    return this.customer.user?.fullName || this.customer.userName || 'Unknown user';
  }

  trackAsset(index: number, asset: { id?: number | string }): number | string {
    return asset.id ?? index;
  }

  isCustomerActive(): boolean {
    console.log('Customer:', this.customer);
    if (!this.customer?.active) {
      return false;
    }

    if (typeof this.customer.active === 'boolean') {
      return this.customer.active;
    }

    const status = String(this.customer.status ?? '').toLowerCase();
    return status === 'active' || status === 'enabled';
  }

  openCustomerAssets(): void {
    if (this.customer?.customerId == null) {
      return;
    }

    this.router.navigate(['/agent/customers', this.customer.customerId, 'assets']);
  }

  openNewAsset(): void {
    if (this.customer?.customerId == null) {
      return;
    }

    this.router.navigate(['/agent/customers', this.customer.customerId, 'assets', 'new']);
  }

  private loadCustomer(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.isLoading = false;

        if (customer.customerId != null) {
          this.assetService.getCustomerAssets(customer.customerId).subscribe({
            next: (assets) => {
              this.customerAssets = assets ?? [];
            },
            error: () => {
              this.customerAssets = [];
            }
          });
        }
      },
      error: () => {
        this.errorMessage = 'Unable to load customer details.';
        this.isLoading = false;
      }
    });
  }
}
