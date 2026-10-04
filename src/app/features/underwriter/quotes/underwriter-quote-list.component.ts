import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { QuoteStatus } from '../../../core/enums/insurance.enums';
import { Quote, QuoteGenerationRequestDto, QuoteRequest } from '../../../core/models/quote.model';
import { QuoteService } from '../../../core/services/quote.service';

@Component({
  selector: 'app-underwriter-quote-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './underwriter-quote-list.component.html'
})
export class UnderwriterQuoteListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly quoteService = inject(QuoteService);

  request: QuoteRequest | null = null;
  quotes: Quote[] = [];
  isLoading = false;
  isGenerating = false;
  errorMessage = '';

  readonly optionDrafts: QuoteGenerationRequestDto[] = [
    { coverageType: 'Comprehensive', coveragePercentage: 80, sumInsured: 0, annualPremium: 0, coveragePeriodYears: 1, renewalPeriodMonths: 12, deductiblePercentage: 5, addons: ['Contents Coverage'] },
    { coverageType: 'Standard', coveragePercentage: 70, sumInsured: 0, annualPremium: 0, coveragePeriodYears: 1, renewalPeriodMonths: 12, deductiblePercentage: 7, addons: ['Temporary Accommodation'] },
    { coverageType: 'Enhanced', coveragePercentage: 90, sumInsured: 0, annualPremium: 0, coveragePeriodYears: 2, renewalPeriodMonths: 12, deductiblePercentage: 5, addons: ['Vehicle Coverage'] }
  ];

  ngOnInit(): void {
    const requestId = this.route.snapshot.paramMap.get('id');
    if (requestId) {
      this.loadRequestQuotes(requestId);
      return;
    }

    this.loadAllQuotes();
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

  generateOptions(): void {
    const requestId = this.request?.id ?? this.request?.quoteRequestId;
    if (!requestId) {
      return;
    }

    this.isGenerating = true;
    this.errorMessage = '';

    this.quoteService.generateQuotesForRequest(requestId, this.optionDrafts).subscribe({
      next: (generated) => {
        this.quotes = generated ?? [];
        this.isGenerating = false;
      },
      error: () => {
        this.errorMessage = 'Quote generation failed.';
        this.isGenerating = false;
      }
    });
  }

  private loadRequestQuotes(requestId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuoteRequest(requestId).subscribe({
      next: (request) => {
        this.request = request;
        this.quoteService.getRequestQuotes(requestId).subscribe({
          next: (quotes) => {
            this.quotes = quotes ?? [];
            this.isLoading = false;
          },
          error: () => {
            this.errorMessage = 'Unable to load generated quotes for this request.';
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Unable to load the quote request.';
        this.isLoading = false;
      }
    });
  }

  private loadAllQuotes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.quotes = quotes ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load generated quotes.';
        this.isLoading = false;
      }
    });
  }
}
