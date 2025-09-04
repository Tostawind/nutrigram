import { inject, Injectable, signal } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MealService } from './meal.service';
import { adjustIngredientsToTarget } from '../utils/nutrition.utils';
import { RECIPE_BY_ID, RECIPES } from '../constants/api';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private _http = inject(HttpClient);
  private _mealService = inject(MealService);

  private _recipes = signal<Recipe[]>([]);
  recipes = this._recipes.asReadonly();

  private _currentRecipe = signal<Recipe | null>(null);
  currentRecipe = this._currentRecipe.asReadonly();

  async getRecipesByMeal(mealId: string): Promise<Recipe[]> {
    const params = new HttpParams().set('meal', mealId);
    const result = await firstValueFrom(
      this._http.get<Recipe[]>(RECIPES, { params })
    );
    this._recipes.set(result);
    return result;
  }

  async getRecipe(recipeId: string, mealId: string): Promise<Recipe> {
    const recipe = await firstValueFrom(
      this._http.get<Recipe>(RECIPE_BY_ID(recipeId))
    );

    // obtener los macros del meal correspondiente
    await this._mealService.getMeal(mealId);
    const targetMacros = this._mealService.currentMeal()?.macros;

    if (targetMacros && recipe.ingredients?.length) {
      const result = await adjustIngredientsToTarget(
        recipe.ingredients,
        targetMacros
      );
      recipe.ingredients = result.ingredients;
      recipe.totalMacros = result.total;
    }

    this._currentRecipe.set(recipe);
    return recipe;
  }

  async updateRecipe(recipe: Recipe): Promise<Recipe> {
    let updated: Recipe;
    if (recipe.id) {
      updated = await firstValueFrom(
        this._http.put<Recipe>(`${RECIPES}/${recipe.id}`, recipe)
      );
    } else {
      updated = await firstValueFrom(this._http.post<Recipe>(RECIPES, recipe));
    }
    return updated;
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    await firstValueFrom(this._http.delete(`${RECIPES}/${recipeId}`));
  }
}
