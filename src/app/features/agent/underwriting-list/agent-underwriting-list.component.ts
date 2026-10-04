import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { QuoteStatus } from '../../../core/enums/insurance.enums';
import { QuoteRequest } from '../../../core/models/quote.model';
import { QuoteService } from '../../../core/services/quote.service';

@Component({
  selector: 'app-agent-underwriting-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-underwriting-list.component.html'
})
export class AgentUnderwritingListComponent implements OnInit {
  private readonly quoteService = inject(QuoteService);

  requests: QuoteRequest[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  trackRequest(index: number, request: QuoteRequest): number | string {
    return request.id ?? index;
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
        return 'Unknown';
    }
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
}
