import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Policy } from '../../../core/models/policy.model';
import { PolicyService } from '../../../core/services/policy.service';

@Component({
  selector: 'app-customer-policy-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-policy-detail.component.html'
})
export class CustomerPolicyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly policyService = inject(PolicyService);

  policy: Policy | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const policyNumber = this.route.snapshot.paramMap.get('policyNumber');
    if (!policyNumber) {
      this.errorMessage = 'Policy not found.';
      return;
    }

    this.loadPolicy(policyNumber);
  }

  private loadPolicy(policyNumber: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.policyService.getPolicy(policyNumber).subscribe({
      next: (policy) => {
        this.policy = policy;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load policy details.';
        this.isLoading = false;
      }
    });
  }
}
