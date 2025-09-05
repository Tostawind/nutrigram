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

  private _splashScreen = signal<{
    visible: boolean;
    status: Status;
    message?: string;
  }>({
    visible: false,
    status: 'loading',
    message: 'CARGANDO',
  });

  // signals públicos
  isLoading = computed(() => this._loadingCounter() > 0);
  errorMessage = computed(() => this._errorMessage());
  splashScreen = computed(() => this._splashScreen());

  // métodos internos
  startLoading(message?: string) {
    this._loadingCounter.update((v) => v + 1);

    // mostrar splash automáticamente si no está visible
    if (!this._splashScreen().visible) {
      this.showSplashScreen('loading', message ?? 'CARGANDO');
    }
  }

  stopLoading() {
    this._loadingCounter.update((v) => Math.max(0, v - 1));

    // Ocultar splash solo si no hay requests y no hay error
    if (this._loadingCounter() === 0 && !this._errorMessage()) {
      this.hideSplashScreen();
    }
  }

  setError(message: string) {
    this._errorMessage.set(message);
    this.toast('Error', message, 'error');

    // Mostrar splash de error
    this.showSplashScreen('error', message);
  }

  clearError() {
    this._errorMessage.set(null);
  }

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
    this._splashScreen.set({ visible: true, status, message });
  }

  hideSplashScreen() {
    this._splashScreen.update((s) => ({ ...s, visible: false }));
  }
}
