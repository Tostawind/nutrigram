import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { SettingsService } from '../../core/services/settings.service';
import { MACROS_DEFAULT } from '../../core/constants/macros';
import { MealService } from '../../core/services/meal.service';
import { StatusSpinnerComponent } from "../../shared/components/status-spinner/status-spinner.component";

@Component({
  selector: 'app-meals',
  imports: [CardModule, RouterLink, MacrosTableComponent, StatusSpinnerComponent],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss',
})
export class MealsComponent implements OnInit {
  settingsService = inject(SettingsService);
  mealService = inject(MealService);

  macrosDefault = MACROS_DEFAULT;

  ngOnInit(): void {
    this.settingsService.getSettings();
    this.mealService.getMeals();
  }
}
