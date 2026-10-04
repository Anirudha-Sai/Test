import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toasts.length">
      <div
        *ngFor="let toast of toasts"
        class="toast"
        [class.toast--success]="toast.type === 'success'"
        [class.toast--error]="toast.type === 'error'"
        [class.toast--info]="toast.type === 'info'"
      >
        {{ toast.message }}
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);

  readonly toasts = this.toastService.toasts;
}
