import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { SettingsService } from '../../core/services/settings.service';
import { MACROS_DEFAULT } from '../../core/constants/macros';
import { MealService } from '../../core/services/meal.service';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [CardModule, RouterLink, MacrosTableComponent],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss',
})
export class MealsComponent implements OnInit {
  private _layoutService = inject(LayoutService);
  settingsService = inject(SettingsService);
  mealService = inject(MealService);

  macrosDefault = MACROS_DEFAULT;

  ngOnInit(): void {
    this._loadData();
  }

  private async _loadData(): Promise<void> {
    try {
      await this.settingsService.getSettings();
      await this.mealService.getMeals();
      // this._layoutService.hideSplashScreen(); // ✅ cerrar spinner al terminar
    } catch {
      // Los services ya muestran el toast y el splash en caso de error
      // Aquí no hace falta repetir la gestión de error
    }
  }
}