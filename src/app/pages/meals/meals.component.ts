import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { SETTINGS } from '../../core/constants/settings';
import { SettingsService } from '../../core/services/settings.service';
import { Meal } from '../../core/models/meal.model';
import { Macros } from '../../core/models/macros.model';
import { MACROS_DEFAULT } from '../../core/constants/macros';
import { MealService } from '../../core/services/meal.service';

@Component({
  selector: 'app-meals',
  imports: [CardModule, RouterLink, MacrosTableComponent],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss',
})
export class MealsComponent implements OnInit {
  readonly settingsService = inject(SettingsService);
  readonly mealService = inject(MealService);

  meals = signal<Meal[]>([]);
  macros = signal<Macros>(MACROS_DEFAULT);

  ngOnInit(): void {
    this._loadSettings();
    this._loadMeals();
  }

  private _loadSettings(): void {
    this.settingsService.getSettings().subscribe((settings) => {
      this.macros.set(settings.macros);
    });
  }

  private _loadMeals() {
    this.mealService.getMeals().subscribe((data) => {
      this.meals.set(data);
    });
  }
}
