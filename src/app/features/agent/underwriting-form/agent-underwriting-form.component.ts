import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AssetType } from '../../../core/enums/insurance.enums';
import { Asset } from '../../../core/models/asset.model';
import { CreateQuoteRequestDto, QuoteRequest } from '../../../core/models/quote.model';
import { AssetService } from '../../../core/services/asset.service';
import { CustomerService } from '../../../core/services/customer.service';
import { QuoteService } from '../../../core/services/quote.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-agent-underwriting-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './agent-underwriting-form.component.html'
})
export class AgentUnderwritingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly assetService = inject(AssetService);
  private readonly customerService = inject(CustomerService);
  private readonly quoteService = inject(QuoteService);
  private readonly toastService = inject(ToastService);

  readonly form = this.fb.nonNullable.group({
    requestedCoverage: [0, [Validators.required, Validators.min(1)]],
    requestedPremium: [0, [Validators.required, Validators.min(0)]],
    requestedPeriodYears: [1, [Validators.required, Validators.min(1)]],
    remarks: ['']
  });

  asset: Asset | null = null;
  customerName = 'Customer';
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  createdRequest: QuoteRequest | null = null;

  ngOnInit(): void {
    const assetId = this.route.snapshot.paramMap.get('id');
    if (!assetId) {
      this.errorMessage = 'Asset was not found for underwriting.';
      return;
    }

    this.loadAsset(assetId);
  }

  getAssetName(): string {
    return this.asset?.name ?? this.asset?.assetName ?? 'Asset';
  }

  getAssetTypeLabel(): string {
    const value = Number(this.asset?.assetType ?? AssetType.ResidentialProperty);
    switch (value) {
      case AssetType.ResidentialProperty:
        return 'Residential Property';
      case AssetType.CommercialProperty:
        return 'Commercial Property';
      case AssetType.Vehicle:
        return 'Vehicle';
      default:
        return 'Asset';
    }
  }

  submit(): void {
    if (!this.asset?.assetId) {
      this.errorMessage = 'Missing asset reference for the underwriting request.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.showError('Please complete the underwriting request correctly.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload: CreateQuoteRequestDto = {
      propertyId: String(this.asset.assetId),
      requestedCoverage: Number(this.form.controls.requestedCoverage.value),
      requestedPremium: Number(this.form.controls.requestedPremium.value),
      requestedPeriodYears: Number(this.form.controls.requestedPeriodYears.value),
      remarks: this.form.controls.remarks.value || undefined
    };

    this.quoteService.createQuoteRequest(payload).subscribe({
        next: (request) => {
            this.isSubmitting = false;
            this.createdRequest = request;
            
            this.toastService.showSuccess('Underwriting request submitted successfully.');
            
            // 2. Route the agent back to the dashboard table immediately
            this.router.navigate(['/agent/underwriting']);
        },
        error: () => {
            this.isSubmitting = false;
            this.errorMessage = 'Unable to submit the underwriting request.';
            this.toastService.showError('Unable to submit the underwriting request.');
        }
    });
  }

  private loadAsset(id: string): void {
    this.isLoading = true;
    this.assetService.getAsset(id).subscribe({
      next: (asset) => {
        this.asset = asset;
        this.isLoading = false;

        if (asset.customerId != null) {
          this.customerService.getCustomer(asset.customerId).subscribe({
            next: (customer) => {
              this.customerName = customer.user?.fullName || customer.userName || 'Customer';
            },
            error: () => {
              this.customerName = 'Customer';
            }
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load the asset for underwriting.';
      }
    });
  }
}
