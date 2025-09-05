import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Recipe } from '../../models/recipe.model';
import { LayoutService } from '../layout.service';
import { MealStoreService } from './meal-store.service';
import { adjustIngredientsToTarget } from '../../utils/nutrition.utils';
import { RecipeApiService } from '../api/recipe-api.service';

@Injectable({ providedIn: 'root' })
export class RecipeStoreService {
  private api = inject(RecipeApiService);
  private layout = inject(LayoutService);
  private mealStore = inject(MealStoreService);

  private _recipes = signal<Recipe[]>([]);
  recipes = this._recipes.asReadonly();

  private _currentRecipe = signal<Recipe | null>(null);
  currentRecipe = this._currentRecipe.asReadonly();

  async loadRecipesByMeal(mealId: string): Promise<void> {
    this.layout.startLoading();
    try {
      const result = await firstValueFrom(this.api.getRecipesByMeal(mealId));
      this._recipes.set(result);
    } catch (err) {
      this.layout.setError('Error al cargar recetas');
    } finally {
      this.layout.stopLoading();
    }
  }

  async loadRecipe(recipeId: string, mealId: string): Promise<void> {
    this.layout.startLoading();
    try {
      const recipe = await firstValueFrom(this.api.getRecipe(recipeId));

      // cargar meal para obtener macros
      await this.mealStore.loadMeal(mealId);
      const targetMacros = this.mealStore.currentMeal()?.macros;

      if (targetMacros && recipe.ingredients?.length) {
        const result = await adjustIngredientsToTarget(
          recipe.ingredients,
          targetMacros
        );
        recipe.ingredients = result.ingredients;
        recipe.totalMacros = result.total;
      }

      this._currentRecipe.set(recipe);
    } catch (err) {
      this.layout.setError('Error al cargar la receta');
    } finally {
      this.layout.stopLoading();
    }
  }

  async saveRecipe(recipe: Recipe): Promise<void> {
    this.layout.startLoading();
    try {
      const updated = await firstValueFrom(this.api.updateRecipe(recipe));

      // actualizar lista de recipes
      this._recipes.update((recipes) =>
        recipes.map((r) => (r.id === updated.id ? updated : r))
      );

      // actualizar currentRecipe si coincide
      if (this._currentRecipe()?.id === updated.id) {
        this._currentRecipe.set(updated);
      }

      this.layout.toast('Receta guardada', '', 'success');
    } catch (err) {
      this.layout.setError('Error al guardar la receta');
    } finally {
      this.layout.stopLoading();
    }
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    this.layout.startLoading();
    try {
      await firstValueFrom(this.api.deleteRecipe(recipeId));

      this._recipes.update((recipes) =>
        recipes.filter((r) => r.id !== recipeId)
      );

      // limpiar currentRecipe si coincide
      if (this._currentRecipe()?.id === recipeId) {
        this._currentRecipe.set(null);
      }

      this.layout.toast('Receta eliminada', '', 'success');
    } catch (err) {
      this.layout.setError('Error al eliminar la receta');
    } finally {
      this.layout.stopLoading();
    }
  }
}
