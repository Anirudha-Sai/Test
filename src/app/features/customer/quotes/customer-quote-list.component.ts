import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { QuoteStatus } from '../../../core/enums/insurance.enums';
import { QuoteRequest } from '../../../core/models/quote.model';
import { QuoteService } from '../../../core/services/quote.service';

@Component({
  selector: 'app-customer-quote-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-quote-list.component.html'
})
export class CustomerQuoteListComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly quoteService = inject(QuoteService);

  requests: QuoteRequest[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  getStatusLabel(status: number | string | undefined): string {
    const value = Number(status ?? 0);
    switch (value) {
      case QuoteStatus.Requested:
        return 'Requested';
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

  getQuoteCount(request: QuoteRequest): number {
    return Array.isArray(request.quotes) ? request.quotes.length : 0;
  }

  private loadRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuoteRequests().subscribe({
      next: (requests) => {
        const currentUser = this.authService.getCurrentUser();
        const filtered = (requests ?? []).filter((request) => this.isCustomerRequest(request, currentUser?.id));
        this.requests = filtered;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load quotation requests.';
        this.isLoading = false;
      }
    });
  }

  private isCustomerRequest(request: QuoteRequest, currentCustomerId: number | string | undefined): boolean {
    if (!currentCustomerId) {
      return true;
    }

    const requestCustomerId = request.customerId;
    if (requestCustomerId != null && String(requestCustomerId) === String(currentCustomerId)) {
      return true;
    }

    const requestRequestedBy = request.requestedBy ?? request.customerName ?? '';
    return requestRequestedBy.toLowerCase() === (this.authService.getCurrentUser()?.fullName ?? '').toLowerCase();
  }
}
