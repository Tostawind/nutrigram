import { Component } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';

@Component({
  selector: 'app-settings',
  imports: [MacrosTableComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
