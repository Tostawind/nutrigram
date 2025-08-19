import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly messageService = inject(MessageService);

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
}
