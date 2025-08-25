import { inject, Injectable, signal } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MealService } from './meal.service';
import {
  adjustIngredientsToTarget
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
      this._layoutService.toast(
        'Error',
        'No se pudieron cargar las recetas',
        'error'
      );
    } finally {
      this._loading.set(false);
    }
  }

  async getRecipe(recipeId: string, mealId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const recipe = await firstValueFrom(
        this._http.get<Recipe>(RECIPE_BY_ID(recipeId))
      );

      await this._mealService.getMeal(mealId);
      const targetMacros = this._mealService.currentMeal()?.macros;

      if (targetMacros && recipe.ingredients?.length) {
        recipe.ingredients = adjustIngredientsToTarget(
          recipe.ingredients,
          targetMacros
        ).ingredients;
        recipe.totalMacros = adjustIngredientsToTarget(
          recipe.ingredients,
          targetMacros
        ).total;
      }

      this._currentRecipe.set(recipe);
    } catch (err) {
      this._error.set(`No se pudo cargar la receta: ${recipeId}`);
      this._layoutService.toast(
        'Error',
        `No se pudo cargar la receta: ${recipeId}`,
        'error'
      );
    } finally {
      this._loading.set(false);
    }
  }

  async updateRecipe(recipe: Recipe): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      if (recipe.id) {
        await firstValueFrom(this._http.put(RECIPES + '/' + recipe.id, recipe));
      } else {
        await firstValueFrom(this._http.post(RECIPES, recipe));
      }
    } catch (err) {
      this._error.set('No se pudo crear la receta');
      this._layoutService.toast('Error', 'No se pudo crear la receta', 'error');
    } finally {
      this._loading.set(false);
    }
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      await firstValueFrom(this._http.delete(RECIPES + '/' + recipeId));
    } catch (err) {
      this._layoutService.toast(
        'Error',
        'No se pudo eliminar la receta',
        'error'
      );
    } finally {
      this._loading.set(false);
    }
  }
}