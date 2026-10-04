import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { QuoteStatus } from '../../../core/enums/insurance.enums';
import { Quote } from '../../../core/models/quote.model';
import { QuoteService } from '../../../core/services/quote.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-underwriter-quote-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './underwriter-quote-detail.component.html'
})
export class UnderwriterQuoteDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly quoteService = inject(QuoteService);
  private readonly toastService = inject(ToastService);

  quote: Quote | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Quote was not found.';
      return;
    }

    this.loadQuote(id);
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

  canApproveOrReject(): boolean {
    return Number(this.quote?.status ?? 0) === QuoteStatus.CustomerSelected;
  }

  approveQuote(): void {
    if (!this.quote?.id) {
      return;
    }

    const confirmed = window.confirm(`Approve this quotation?\n\nQuote: ${this.quote.referenceNumber ?? this.quote.quoteReference ?? this.quote.id}\nAnnual Premium: ${this.quote.annualPremium ?? this.quote.premium ?? '—'}`);
    if (!confirmed) {
      return;
    }

    this.quoteService.approveQuote(this.quote.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Quotation approved successfully.');
        this.loadQuote(String(this.quote?.id));
      },
      error: () => {
        this.toastService.showError('Unable to approve this quotation.');
      }
    });
  }

  rejectQuote(): void {
    if (!this.quote?.id) {
      return;
    }

    const reason = window.prompt('Reject quotation\n\nReason:', '');
    if (!reason || !reason.trim()) {
      this.toastService.showError('A rejection reason is required.');
      return;
    }

    this.quoteService.rejectQuote(this.quote.id, reason).subscribe({
      next: () => {
        this.toastService.showSuccess('Quotation rejected.');
        this.loadQuote(String(this.quote?.id));
      },
      error: () => {
        this.toastService.showError('Unable to reject this quotation.');
      }
    });
  }

  private loadQuote(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuote(id).subscribe({
      next: (quote) => {
        this.quote = quote;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the quotation.';
        this.isLoading = false;
      }
    });
  }
}
