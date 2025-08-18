import { Component, inject, OnInit } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { SettingsService } from '../../core/services/settings.service';
import { MealService } from '../../core/services/meal.service';
import { LayoutService } from '../../core/services/layout.service';
import { Macros } from '../../core/models/macros.model';

@Component({
  selector: 'app-settings',
  imports: [MacrosTableComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  readonly layoutService = inject(LayoutService);
  settingsService = inject(SettingsService);
  mealService = inject(MealService);

  ngOnInit() {
    this.settingsService.getSettings();
    this.mealService.getMeals();
  }

  updateSettings(macros: Macros[]) {
    const current = this.settingsService.settings();
    if (!current) return;

    const updated = { ...current, macros: macros[0] };

    this.settingsService.updateSettings(updated);
  }

  updateMeal(macros: Macros[], mealId: string) {
    const current = this.mealService.meals();
    const meal = current?.find((m) => m.id === mealId);
    if (!meal) return;

    const updated = { ...meal, macros: macros[0] };

    this.mealService.updateMeal(updated);
  }
}
