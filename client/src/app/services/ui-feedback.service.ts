import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiFeedbackService {
  loading = signal(false);
  loadingMessage = signal('Please wait...');
  toastMessage = signal('');
  toastType = signal<'success' | 'error' | 'info'>('info');

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  showLoading(message: string): void {
    this.loadingMessage.set(message);
    this.loading.set(true);
  }

  hideLoading(): void {
    this.loading.set(false);
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info', durationMs: number = 2600): void {
    this.toastMessage.set(message);
    this.toastType.set(type);

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.clearToast();
    }, durationMs);
  }

  clearToast(): void {
    this.toastMessage.set('');
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }
}
