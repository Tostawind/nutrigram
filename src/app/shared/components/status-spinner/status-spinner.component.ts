import { Component, input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Status } from '../../../core/models/status.model';
@Component({
  selector: 'app-status-spinner',
  imports: [ProgressSpinnerModule],
  templateUrl: './status-spinner.component.html',
  styleUrl: './status-spinner.component.scss'
})
export class StatusSpinnerComponent {
  status = input<Status>('loading');
  label = input<string>('');
}
