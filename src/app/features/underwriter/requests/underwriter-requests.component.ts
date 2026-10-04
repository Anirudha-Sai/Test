import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { QuoteStatus } from '../../../core/enums/insurance.enums';
import { QuoteRequest } from '../../../core/models/quote.model';
import { QuoteService } from '../../../core/services/quote.service';

@Component({
  selector: 'app-underwriter-requests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './underwriter-requests.component.html'
})
export class UnderwriterRequestsComponent implements OnInit {
  private readonly quoteService = inject(QuoteService);

  requests: QuoteRequest[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  trackRequest(index: number, request: QuoteRequest): number | string {
    return request.id ?? request.quoteRequestId ?? index;
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
        return this.toStringStatus(status);
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

  getTitle(request: QuoteRequest): string {
    return request.assetName ?? request.propertyName ?? request.requestedBy ?? 'Request';
  }

  private loadRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuoteRequests().subscribe({
      next: (requests) => {
        this.requests = requests ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load underwriting requests.';
        this.isLoading = false;
      }
    });
  }

  private toStringStatus(status: number | string | undefined): string {
    if (status == null) {
      return 'Unknown';
    }

    const normalized = String(status).trim();
    if (!normalized) {
      return 'Unknown';
    }

    const map: Record<string, string> = {
      requested: 'Requested',
      generated: 'Generated',
      customerselected: 'Customer Selected',
      approved: 'Approved',
      rejected: 'Rejected',
      expired: 'Expired',
      convertedtopolicy: 'Converted To Policy'
    };

    return map[normalized.toLowerCase().replace(/\s+/g, '')] ?? normalized;
  }
}
