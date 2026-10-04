import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { QuoteStatus } from '../../../core/enums/insurance.enums';
import { Quote, QuoteRequest } from '../../../core/models/quote.model';
import { QuoteService } from '../../../core/services/quote.service';

@Component({
  selector: 'app-underwriter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './underwriter-dashboard.component.html'
})
export class UnderwriterDashboardComponent implements OnInit {
  private readonly quoteService = inject(QuoteService);

  stats = [
    { label: 'Pending requests', value: 0, tone: 'warning' },
    { label: 'Generated quotes', value: 0, tone: 'accent' },
    { label: 'Awaiting customer selection', value: 0, tone: 'neutral' },
    { label: 'Approved quotes', value: 0, tone: 'success' },
    { label: 'Rejected quotes', value: 0, tone: 'danger' }
  ];

  recentRequests: QuoteRequest[] = [];
  recentQuotes: Quote[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuoteRequests().subscribe({
      next: (requests) => {
        const quoteRequests = requests ?? [];
        this.recentRequests = quoteRequests.slice(0, 5);

        this.quoteService.getQuotes().subscribe({
          next: (quotes) => {
            const allQuotes = quotes ?? [];
            this.recentQuotes = allQuotes.slice(0, 5);
            this.updateStats(quoteRequests, allQuotes);
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.errorMessage = 'Unable to load underwriting dashboard data.';
          }
        });
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load underwriting requests.';
      }
    });
  }

  private updateStats(requests: QuoteRequest[], quotes: Quote[]): void {
    const pendingRequests = requests.filter((request) => this.getStatusNumber(request.status) === QuoteStatus.Requested).length;
    const generatedQuotes = quotes.filter((quote) => this.getStatusNumber(quote.status) === QuoteStatus.Generated).length;
    const awaitingSelection = quotes.filter((quote) => this.getStatusNumber(quote.status) === QuoteStatus.CustomerSelected).length;
    const approvedQuotes = quotes.filter((quote) => this.getStatusNumber(quote.status) === QuoteStatus.Approved).length;
    const rejectedQuotes = quotes.filter((quote) => this.getStatusNumber(quote.status) === QuoteStatus.Rejected).length;

    this.stats = [
      { label: 'Pending requests', value: pendingRequests, tone: 'warning' },
      { label: 'Generated quotes', value: generatedQuotes, tone: 'accent' },
      { label: 'Awaiting customer selection', value: awaitingSelection, tone: 'neutral' },
      { label: 'Approved quotes', value: approvedQuotes, tone: 'success' },
      { label: 'Rejected quotes', value: rejectedQuotes, tone: 'danger' }
    ];
  }

  private getStatusNumber(status: number | string | undefined): number {
    if (typeof status === 'number') {
      return status;
    }

    if (typeof status === 'string') {
      const normalized = status.trim().toLowerCase();
      const match = Object.entries(QuoteStatus).find(([, value]) => value.toString().toLowerCase() === normalized || value.toString().toLowerCase().replace(/\s+/g, '') === normalized.replace(/\s+/g, ''));
      if (match) {
        return Number(match[1]);
      }

      const labelMap: Record<string, number> = {
        requested: QuoteStatus.Requested,
        generated: QuoteStatus.Generated,
        customerselected: QuoteStatus.CustomerSelected,
        approved: QuoteStatus.Approved,
        rejected: QuoteStatus.Rejected,
        expired: QuoteStatus.Expired,
        convertedtopolicy: QuoteStatus.ConvertedToPolicy
      };

      return labelMap[normalized.replace(/\s+/g, '').toLowerCase()] ?? 0;
    }

    return 0;
  }
}
