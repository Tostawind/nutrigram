import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { CardModule } from 'primeng/card';
import { Recipe } from '../../core/models/recipe.model';
import { HttpClient } from '@angular/common/http';
import { SETTINGS } from '../../core/constants/settings';
import { Meal } from '../../core/models/meal.model';

const DEFAULT_MACROS = { kcal: 0, protein: 0, carbs: 0, fats: 0 };

@Component({
  selector: 'app-recipes',
  imports: [MacrosTableComponent, RouterLink, CardModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent implements OnInit {
  meal: Meal = {
    id: null,
    name: 'Meal',
    macros: DEFAULT_MACROS,
  };
  recipes: Recipe[] = [];

  private _route = inject(ActivatedRoute);
  private _http = inject(HttpClient);

  ngOnInit() {
    this.meal.id = this._route.snapshot.paramMap.get('mealId');
    this.meal.name =
      SETTINGS.meals.find((meal) => meal.id === this.meal.id)?.name || 'Meal';
    this.meal.macros =
      SETTINGS.meals.find((meal) => meal.id === this.meal.id)?.macros ||
      DEFAULT_MACROS;

    this._http.get<Recipe[]>(`data/recipes.json`).subscribe((recipes) => {
      this.recipes = recipes;
    });
  }
}
