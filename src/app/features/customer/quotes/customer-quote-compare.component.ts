import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { QuoteStatus } from '../../../core/enums/insurance.enums';
import { Quote, QuoteRequest } from '../../../core/models/quote.model';
import { QuoteService } from '../../../core/services/quote.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-quote-compare',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-quote-compare.component.html'
})
export class CustomerQuoteCompareComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly quoteService = inject(QuoteService);
  private readonly toastService = inject(ToastService);

  request: QuoteRequest | null = null;
  quotes: Quote[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const requestId = this.route.snapshot.paramMap.get('requestId');
    if (!requestId) {
      this.errorMessage = 'Quotation request not found.';
      return;
    }

    this.loadQuotes(requestId);
  }

  canSelectQuote(quote: Quote): boolean {
    return Number(quote.status ?? 0) === QuoteStatus.Generated;
  }

  getStatusLabel(status: number | string | undefined): string {
    const value = Number(status ?? 0);
    switch (value) {
      case QuoteStatus.Generated:
        return 'Generated';
      case QuoteStatus.CustomerSelected:
        return 'Selected';
      case QuoteStatus.Approved:
        return 'Approved';
      case QuoteStatus.Rejected:
        return 'Rejected';
      case QuoteStatus.Expired:
        return 'Expired';
      case QuoteStatus.ConvertedToPolicy:
        return 'Converted to Policy';
      default:
        return String(status ?? 'Unknown');
    }
  }

  getStatusTone(status: number | string | undefined): string {
    const value = Number(status ?? 0);
    switch (value) {
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

  selectQuote(quote: Quote): void {
    if (!quote.id) {
      return;
    }

    const confirmed = window.confirm(`Select this quotation?\n\nQuote: ${quote.referenceNumber ?? quote.quoteReference ?? quote.id}\nCoverage: ${quote.coverageType ?? '—'}\nAnnual Premium: ${quote.annualPremium ?? quote.premium ?? '—'}`);
    if (!confirmed) {
      return;
    }

    this.quoteService.selectQuote(quote.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Quotation selected successfully.');
        const requestId = this.request?.id ?? this.request?.quoteRequestId;
        if (requestId) {
          window.location.href = `/customer/quotes/${requestId}/selected?quoteId=${encodeURIComponent(String(quote.id))}`;
        }
      },
      error: () => {
        this.toastService.showError('Quotation selection failed.');
      }
    });
  }

  private loadQuotes(requestId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuoteRequest(requestId).subscribe({
      next: (request) => {
        this.request = request;
        this.quoteService.getQuotesForRequest(requestId).subscribe({
          next: (quotes) => {
            this.quotes = quotes ?? [];
            this.isLoading = false;
          },
          error: () => {
            this.errorMessage = 'Unable to load quotations for comparison.';
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Unable to load quotation request.';
        this.isLoading = false;
      }
    });
  }
}
