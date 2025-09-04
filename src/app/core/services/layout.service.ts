import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Status } from '../models/status.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly messageService = inject(MessageService);

  // contador de requests activas
  private _loadingCounter = signal(0);

  // estado de error global
  private _errorMessage = signal<string | null>(null);

  // signals públicos
  loading = computed(() => this._loadingCounter() > 0);
  error = this._errorMessage.asReadonly();

  // métodos internos
  startLoading() {
    this._loadingCounter.update(v => v + 1);
  }

  stopLoading() {
    this._loadingCounter.update(v => Math.max(0, v - 1));
  }

  setError(message: string) {
    this._errorMessage.set(message);
    this.toast('Error', message, 'error');
  }

  clearError() {
    this._errorMessage.set(null);
  }

  splashScrren: {visible: boolean; status: Status; message?: string} = {
    visible: false,
    status: 'loading',
    message: 'CARGANDO',
  };

  toast(
    title: string,
    message: string,
    severity: 'info' | 'success' | 'warn' | 'error' = 'info'
  ) {
    this.messageService.add({
      summary: title,
      detail: message,
      severity,
    });
  }

  showSplashScreen(status: Status, message?: string) {
    this.splashScrren = { visible: true, status, message };
  }

  hideSplashScreen() {
    this.splashScrren.visible = false;
  }
}
