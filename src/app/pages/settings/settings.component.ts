import { Component, inject, OnInit, signal } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { Settings } from '../../core/models/settings.model';
import { SETTINGS } from '../../core/constants/settings';
import { SettingsService } from '../../core/services/settings.service';
import { Macros } from '../../core/models/macros.model';

@Component({
  selector: 'app-settings',
  imports: [MacrosTableComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  readonly settingsService = inject(SettingsService);

  settings = signal<Settings | null>(null);

  ngOnInit() {
    this._loadSettings();
  }

  private _loadSettings() {
    this.settingsService.getSettings().subscribe((data) => {
      this.settings.set(data);
    });
  }

  private _saveSettings(updated: Settings) {
    this.settingsService.updateSettings(updated).subscribe((data) => {
      this.settings.set(data);
    });
  }

  updateMainMacros(macros: Macros[]) {
    const current = this.settings();
    if (!current) return;

    const updated = { ...current, macros: macros[0] };
    this._saveSettings(updated);
  }

  updateMealMacros(macros: Macros[], mealId: string) {
    const current = this.settings();
    if (!current) return;

    const meal = current.meals.find((m) => m.id === mealId);
    if (!meal) return;

    const updatedMeal = { ...meal, macros: macros[0] };
    const updated = {
      ...current,
      meals: current.meals.map((m) => (m.id === mealId ? updatedMeal : m)),
    };

    this._saveSettings(updated);
  }
}
