import { inject, Injectable, signal } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MealService } from './meal.service';
import { adjustIngredientsToTarget } from '../utils/nutrition.utils';
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

  async getRecipesByMeal(mealId: string): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      const params = new HttpParams().set('meal', mealId);
      const result = await firstValueFrom(
        this._http.get<Recipe[]>(RECIPES, { params })
      );
      this._recipes.set(result);
      this._layoutService.hideSplashScreen();
    } catch (err) {
      this._layoutService.showSplashScreen(
        'error','No se pudieron cargar las recetas');
      this._layoutService.toast(
        'Error',
        'No se pudieron cargar las recetas',
        'error'
      );
    } 
  }

  async getRecipe(recipeId: string, mealId: string): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      const recipe = await firstValueFrom(
        this._http.get<Recipe>(RECIPE_BY_ID(recipeId))
      );

      await this._mealService.getMeal(mealId);
      const targetMacros = this._mealService.currentMeal()?.macros;

      if (targetMacros && recipe.ingredients?.length) {
        const result = await adjustIngredientsToTarget(
          recipe.ingredients,
          targetMacros
        );
        console.log('RESULT', result);
        recipe.ingredients = result.ingredients;
        recipe.totalMacros = result.total;
      }

      this._currentRecipe.set(recipe);
      this._layoutService.hideSplashScreen();
    } catch (err) {
      this._layoutService.showSplashScreen(
        'error',`No se pudo cargar la receta: ${recipeId}`);
      this._layoutService.toast(
        'Error',
        `No se pudo cargar la receta: ${recipeId}`,
        'error'
      );
    } 
  }

  async updateRecipe(recipe: Recipe): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      if (recipe.id) {
        await firstValueFrom(this._http.put(RECIPES + '/' + recipe.id, recipe));
        this._layoutService.hideSplashScreen();
      } else {
        await firstValueFrom(this._http.post(RECIPES, recipe));
      }
    } catch (err) {
      this._layoutService.toast('Error', 'No se pudo crear la receta', 'error');
    }  finally {
      this._layoutService.hideSplashScreen();
    }
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      await firstValueFrom(this._http.delete(RECIPES + '/' + recipeId));
    } catch (err) {
      this._layoutService.toast(
        'Error',
        'No se pudo eliminar la receta',
        'error'
      );
    } finally {
      this._layoutService.hideSplashScreen();
    } 
  }
}
