import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PolicyService } from '../../../core/services/policy.service';
import { Policy } from '../../../core/models/policy.model';

@Component({
  selector: 'app-customer-policies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-policies.component.html'
})
export class CustomerPoliciesComponent implements OnInit {
  private readonly policyService = inject(PolicyService);

  policies: Policy[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPolicies();
  }

  private loadPolicies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.policyService.getPolicies().subscribe({
      next: (policies) => {
        this.policies = policies ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load policies.';
        this.isLoading = false;
      }
    });
  }
}
