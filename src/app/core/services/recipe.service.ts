import { inject, Injectable, signal } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MealService } from './meal.service';
import {
  adjustIngredientsToTarget,
  calculateIngredientGrams,
  scaleMacros,
} from '../utils/nutrition.utils';
import { RECIPE_BY_ID, RECIPES } from '../constants/api';
import { LayoutService } from './layout.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private _http = inject(HttpClient);
  private _mealService = inject(MealService);
  private _layoutService = inject(LayoutService);

  private _recipes = signal<Recipe[]>([]);
  recipes = this._recipes.asReadonly();

  private _currentRecipe = signal<Recipe | null>(null);
  currentRecipe = this._currentRecipe.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  async getRecipesByMeal(mealId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const params = new HttpParams().set('meal', mealId);
      const result = await firstValueFrom(
        this._http.get<Recipe[]>(RECIPES, { params })
      );
      this._recipes.set(result);
    } catch (err) {
      this._error.set('No se pudieron cargar las recetas');
      this._layoutService.toast('Error', 'No se pudieron cargar las recetas', 'error');
    } finally {
      this._loading.set(false);
    }
  }

  async getRecipe(recipeId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const recipe = await firstValueFrom(
        this._http.get<Recipe>(RECIPE_BY_ID(recipeId))
      );
      // 🔹 Tomamos la primera meal de la receta para objetivo
      const targetMacros = this._mealService.meals().find((m) => m.id === recipe.meals[0])?.macros;

      if (targetMacros && recipe.ingredients?.length) {
        recipe.ingredients = adjustIngredientsToTarget(recipe.ingredients, targetMacros);
      }

      this._currentRecipe.set(recipe);
    } catch (err) {
      this._error.set(`No se pudo cargar la receta: ${recipeId}`);
      this._layoutService.toast('Error', `No se pudo cargar la receta: ${recipeId}`, 'error');

    } finally {
      this._loading.set(false);
    }
  }
}
