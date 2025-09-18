import { Component, inject } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { LayoutService } from '../../core/services/layout.service';
import { Macros } from '../../core/models/macros.model';
import { calculateCalories } from '../../core/utils/nutrition.utils';
import { SettingsStoreService } from '../../core/services/stores/settings-store.service';
import { MealStoreService } from '../../core/services/stores/meal-store.service';
import { MACROS_DEFAULT } from '../../core/constants/macros';

@Component({
  selector: 'app-settings',
  imports: [MacrosTableComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  readonly layoutService = inject(LayoutService);
  settingsStore = inject(SettingsStoreService);
  mealStore = inject(MealStoreService);

  macrosDefault = MACROS_DEFAULT;
  

  updateSettings(macros: Macros[]) {
    const current = this.settingsStore.settings();
    if (!current) return;

    const newMacros: Macros = {
      ...macros[0],
      kcal: calculateCalories(
        macros[0].protein,
        macros[0].carbs,
        macros[0].fat
      ),
    };

    const updated = { ...current, macros: newMacros };

    this.settingsStore.updateSettings(updated);
  }

  updateMeal(macros: Macros[], mealId: string) {
    const current = this.mealStore.meals();
    const meal = current?.find((m) => m.id === mealId);
    if (!meal) return;

    const newMacros: Macros = {
      ...macros[0],
      kcal: calculateCalories(
        macros[0].protein,
        macros[0].carbs,
        macros[0].fat
      ),
    };

    const updated = { ...meal, macros: newMacros };

    this.mealStore.updateMeal(updated);
  }

  getTotals() {
    const meals = this.mealStore.meals();
    if (!meals) return null;

    return meals.reduce(
      (acc, meal) => {
        acc.kcal += meal.macros.kcal;
        acc.protein += meal.macros.protein;
        acc.carbs += meal.macros.carbs;
        acc.fat += meal.macros.fat;
        return acc;
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  getDiffs() {
    const totals = this.getTotals();
    const settings = this.settingsStore.settings();

    if (!totals || !settings) return null;

    return {
      kcal: totals.kcal - settings.macros.kcal,
      protein: totals.protein - settings.macros.protein,
      carbs: totals.carbs - settings.macros.carbs,
      fat: totals.fat - settings.macros.fat,
    };
  }
}
