import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { CardModule } from 'primeng/card';
import { Recipe } from '../../core/models/recipe.model';
import { HttpClient } from '@angular/common/http';
import { Meal } from '../../core/models/meal.model';
import { SettingsService } from '../../core/services/settings.service';

const DEFAULT_MEAL = {
  id: '',
  name: 'Error',
  macros: { kcal: 0, protein: 0, carbs: 0, fats: 0 },
};

@Component({
  selector: 'app-recipes',
  imports: [MacrosTableComponent, RouterLink, CardModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _http = inject(HttpClient);
  private _settingsService = inject(SettingsService);

  meal: Meal = DEFAULT_MEAL;
  recipes: Recipe[] = [];

  ngOnInit() {
    const mealId = this._route.snapshot.paramMap.get('mealId') || '';

    this.meal = this._settingsService.getMealById(mealId) || DEFAULT_MEAL;

    this._http.get<Recipe[]>(`data/recipes.json`).subscribe((recipes) => {
      this.recipes = recipes;
    });
  }
}
