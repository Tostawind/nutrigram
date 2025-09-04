import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Status } from '../models/status.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly messageService = inject(MessageService);

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
