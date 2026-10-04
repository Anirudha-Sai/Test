import { Injectable } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts: ToastMessage[] = [];

  showSuccess(message: string): void {
    this.push('success', message);
  }

  showError(message: string): void {
    this.push('error', message);
  }

  showInfo(message: string): void {
    this.push('info', message);
  }

  private push(type: ToastMessage['type'], message: string): void {
    const toast: ToastMessage = {
      id: Date.now() + Math.random(),
      type,
      message
    };

    this.toasts.push(toast);

    window.setTimeout(() => {
      const index = this.toasts.findIndex((item) => item.id === toast.id);
      if (index >= 0) {
        this.toasts.splice(index, 1);
      }
    }, 3500);
  }
}
