import { Component, input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-status-spinner',
  imports: [ProgressSpinnerModule],
  templateUrl: './status-spinner.component.html',
  styleUrl: './status-spinner.component.scss'
})
export class StatusSpinnerComponent {
  status = input<'loading' | 'success' | 'error'>('loading');
  label = input<string>('');
}
