import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
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
export class MealsComponent {
  settingsStore = inject(SettingsStoreService);
  mealStore = inject(MealStoreService);

  macrosDefault = MACROS_DEFAULT;
}