import { Component, OnInit } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { Settings } from '../../core/models/settings.model';
import { SETTINGS } from '../../core/constants/settings';

@Component({
  selector: 'app-settings',
  imports: [MacrosTableComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  settings: Settings | null = null;

  ngOnInit() {
    // Simulate fetching settings from a service or store
    this.settings = SETTINGS;
  }
}
