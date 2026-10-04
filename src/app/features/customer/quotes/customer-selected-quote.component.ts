import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { QuoteStatus } from '../../../core/enums/insurance.enums';
import { Quote, QuoteRequest } from '../../../core/models/quote.model';
import { QuoteService } from '../../../core/services/quote.service';

@Component({
  selector: 'app-customer-selected-quote',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-selected-quote.component.html'
})
export class CustomerSelectedQuoteComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly quoteService = inject(QuoteService);

  request: QuoteRequest | null = null;
  quote: Quote | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const requestId = this.route.snapshot.paramMap.get('requestId');
    const quoteId = this.route.snapshot.queryParamMap.get('quoteId');

    if (requestId) {
      this.loadByRequest(requestId, quoteId ?? undefined);
      return;
    }

    if (quoteId) {
      this.loadByQuoteId(quoteId);
      return;
    }

    this.errorMessage = 'No quotation was selected.';
  }

  getConfirmationMessage(): string {
    if (!this.quote) {
      return 'Your quotation has been submitted for underwriting approval.';
    }

    const status = Number(this.quote.status ?? 0);
    if (status === QuoteStatus.Approved) {
      return 'Your quotation has been approved.';
    }
    if (status === QuoteStatus.Rejected) {
      return 'Your quotation was rejected.';
    }
    return 'Your quotation has been submitted for underwriting approval.';
  }

  private loadByRequest(requestId: string, quoteId?: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuoteRequest(requestId).subscribe({
      next: (request) => {
        this.request = request;
        this.quoteService.getQuotesForRequest(requestId).subscribe({
          next: (quotes) => {
            const selectedQuote = quoteId ? quotes.find((item) => String(item.id) === quoteId) : quotes.find((item) => Number(item.status ?? 0) === QuoteStatus.CustomerSelected) ?? quotes[0];
            this.quote = selectedQuote ?? null;
            this.isLoading = false;
          },
          error: () => {
            this.errorMessage = 'Unable to load the selected quotation.';
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

  private loadByQuoteId(quoteId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuote(quoteId).subscribe({
      next: (quote) => {
        this.quote = quote;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the selected quotation.';
        this.isLoading = false;
      }
    });
  }
}
