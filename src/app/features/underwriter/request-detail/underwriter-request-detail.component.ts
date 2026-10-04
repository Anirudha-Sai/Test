import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { QuoteStatus } from '../../../core/enums/insurance.enums';
import { QuoteRequest } from '../../../core/models/quote.model';
import { QuoteService } from '../../../core/services/quote.service';
import { AssetService } from '../../../core/services/asset.service';
import { Asset } from '../../../core/models/asset.model';

@Component({
  selector: 'app-underwriter-request-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './underwriter-request-detail.component.html'
})
export class UnderwriterRequestDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quoteService = inject(QuoteService);
  private readonly assetService = inject(AssetService);

  request: QuoteRequest | null = null;
  asset : Asset | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Request was not found.';
      return;
    }

    this.loadRequest(id);
  }

  getRequestTitle(): string {
    return this.request?.assetName ?? this.request?.propertyName ?? this.request?.requestedBy ?? 'Request';
  }

  getStatusLabel(status: number | string | undefined): string {
    const value = Number(status ?? 0);
    switch (value) {
      case QuoteStatus.Requested:
        return 'Requested';
      case QuoteStatus.Generated:
        return 'Generated';
      case QuoteStatus.CustomerSelected:
        return 'Customer Selected';
      case QuoteStatus.Approved:
        return 'Approved';
      case QuoteStatus.Rejected:
        return 'Rejected';
      case QuoteStatus.Expired:
        return 'Expired';
      case QuoteStatus.ConvertedToPolicy:
        return 'Converted To Policy';
      default:
        return String(status ?? 'Unknown');
    }
  }

  getStatusTone(status: number | string | undefined): string {
    const value = Number(status ?? 0);
    switch (value) {
      case QuoteStatus.Requested:
        return 'pending';
      case QuoteStatus.Generated:
        return 'informational';
      case QuoteStatus.CustomerSelected:
        return 'attention';
      case QuoteStatus.Approved:
      case QuoteStatus.ConvertedToPolicy:
        return 'success';
      case QuoteStatus.Rejected:
        return 'error';
      case QuoteStatus.Expired:
        return 'muted';
      default:
        return 'informational';
    }
  }

  viewRiskAssessment(): void {
    if (!this.request?.id && !this.request?.quoteRequestId) {
      return;
    }

    const id = this.request?.id ?? this.request?.quoteRequestId;
    this.router.navigate(['/underwriter/requests', id, 'risk-assessment']);
  }

  viewQuotes(): void {
    if (!this.request?.id && !this.request?.quoteRequestId) {
      return;
    }

    const id = this.request?.id ?? this.request?.quoteRequestId;
    this.router.navigate(['/underwriter/requests', id, 'quotes']);
  }

  private loadRequest(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuoteRequest(id).subscribe({
      next: (request) => {
        console.log('Loaded request:', request);
        this.request = request;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the underwriting request.';
        this.isLoading = false;
      }
    });

    this.assetService.getAsset(this.request?.assetId).subscribe({
      next: (asset) => {
        console.log('Loaded asset:', asset);
        this.asset = asset;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the Asset Details.';
        this.isLoading = false;
      }
    });
  }
}
