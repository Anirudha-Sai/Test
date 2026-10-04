import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { QuoteStatus } from '../../../core/enums/insurance.enums';
import { Quote } from '../../../core/models/quote.model';
import { QuoteService } from '../../../core/services/quote.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-underwriter-approval-queue',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './underwriter-approval-queue.component.html'
})
export class UnderwriterApprovalQueueComponent implements OnInit {
  private readonly quoteService = inject(QuoteService);
  private readonly toastService = inject(ToastService);

  quotes: Quote[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadApprovalQueue();
  }

  getStatusLabel(status: number | string | undefined): string {
    const value = Number(status ?? 0);
    switch (value) {
      case QuoteStatus.CustomerSelected:
        return 'Customer Selected';
      case QuoteStatus.Approved:
        return 'Approved';
      case QuoteStatus.Rejected:
        return 'Rejected';
      default:
        return String(status ?? 'Unknown');
    }
  }

  getStatusTone(status: number | string | undefined): string {
    const value = Number(status ?? 0);
    switch (value) {
      case QuoteStatus.CustomerSelected:
        return 'attention';
      case QuoteStatus.Approved:
        return 'success';
      case QuoteStatus.Rejected:
        return 'error';
      default:
        return 'informational';
    }
  }

  approveQuote(quote: Quote): void {
    if (!quote.id) {
      return;
    }

    const confirmed = window.confirm(`Approve this quotation?\n\nQuote: ${quote.referenceNumber ?? quote.quoteReference ?? quote.id}\nAnnual Premium: ${quote.annualPremium ?? quote.premium ?? '—'}`);
    if (!confirmed) {
      return;
    }

    this.quoteService.approveQuote(quote.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Quotation approved successfully.');
        this.loadApprovalQueue();
      },
      error: () => {
        this.toastService.showError('Unable to approve this quotation.');
      }
    });
  }

  rejectQuote(quote: Quote): void {
    if (!quote.id) {
      return;
    }

    const reason = window.prompt('Reject quotation\n\nReason:', '');
    if (!reason || !reason.trim()) {
      this.toastService.showError('A rejection reason is required.');
      return;
    }

    this.quoteService.rejectQuote(quote.id, reason).subscribe({
      next: () => {
        this.toastService.showSuccess('Quotation rejected.');
        this.loadApprovalQueue();
      },
      error: () => {
        this.toastService.showError('Unable to reject this quotation.');
      }
    });
  }

  private loadApprovalQueue(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.quotes = (quotes ?? []).filter((quote) => Number(quote.status ?? 0) === QuoteStatus.CustomerSelected);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the approval queue.';
        this.isLoading = false;
      }
    });
  }
}
