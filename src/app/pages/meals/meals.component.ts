import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { LayoutService } from '../../core/services/layout.service';
import { MealStoreService } from '../../core/services/stores/meal-store.service';
import { MACROS_DEFAULT } from '../../core/constants/macros';
import { SettingsStoreService } from '../../core/services/stores/settings-store.service';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [CardModule, RouterLink, MacrosTableComponent],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss',
})
export class MealsComponent implements OnInit {
  private _layoutService = inject(LayoutService);
  settingsStore = inject(SettingsStoreService);
  mealStore = inject(MealStoreService);

  macrosDefault = MACROS_DEFAULT;

  ngOnInit(): void {
    this._loadData();
  }

  private async _loadData(): Promise<void> {
    await this.settingsStore.loadSettings();
    await this.mealStore.loadMeals();
  }
}