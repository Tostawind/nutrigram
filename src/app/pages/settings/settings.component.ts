import { Component, inject, OnInit, signal } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { Settings } from '../../core/models/settings.model';
import { SettingsService } from '../../core/services/settings.service';
import { MealService } from '../../core/services/meal.service';
import { Meal } from '../../core/models/meal.model';
import { LayoutService } from '../../core/services/layout.service';
import { Macros } from '../../core/models/macros.model';

type LoadingStatus = 'ok' | 'loading' | 'error';

@Component({
  selector: 'app-settings',
  imports: [MacrosTableComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  readonly settingsService = inject(SettingsService);
  readonly mealService = inject(MealService);
  readonly layoutService = inject(LayoutService);

  settings = signal<Settings | null>(null);
  meals = signal<Meal[]>([]);
  settingsStatus = signal<LoadingStatus>('ok');
  mealsStatus = signal<LoadingStatus>('ok');

  ngOnInit() {
    this._loadSettings();
    this._loadMeals();
  }

  private _loadSettings() {
    this.settingsStatus.set('loading');
    this.settingsService.getSettings().subscribe({
      next: (data) => {
        this.settings.set(data);
        this.settingsStatus.set('ok');
      },
      error: (err) => {
        this.layoutService.toast('Error al cargar la configuración', 'error');
        this.settingsStatus.set('error');
      },
    });
  }

  private _loadMeals() {
    this.mealService.getMeals().subscribe((data) => {
      this.meals.set(data);
    });
  }

  updateSettings(macros: Macros[]) {
    const current = this.settings();
    if (!current) return;

    const updated = { ...current, macros: macros[0] };

    this.settingsService.updateSettings(updated).subscribe((data) => {
      this.settings.set(data);
      this.layoutService.toast(
        'Configuración actualizada con exito',
        'success'
      );
    });
  }

  updateMeal(macros: Macros[], mealId: string) {
    const current = this.meals();
    const meal = current.find((m) => m.id === mealId);
    if (!meal) return;

    const updated = { ...meal, macros: macros[0] };

    this.mealService.updateMeal(updated).subscribe((data) => {
      const meals = this.meals();
      const index = meals.findIndex((m) => m.id === mealId);
      if (index !== -1) {
        meals[index] = data;
        this.meals.set(meals);
      }
    });
  }
}
