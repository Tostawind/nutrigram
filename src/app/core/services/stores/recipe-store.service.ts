import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Recipe } from '../../models/recipe.model';
import { LayoutService } from '../layout.service';
import { MealStoreService } from './meal-store.service';
import { adjustIngredientsToTarget } from '../../utils/nutrition.utils';
import { RecipeApiService } from '../api/recipe-api.service';
import { IngredientStoreService } from './ingredient-store.service';
import { fromApiRecipe } from '../../adapters/recipe.adapter';
import { Ingredient } from '../../models/ingredient.model';

@Injectable({ providedIn: 'root' })
export class RecipeStoreService {
  private api = inject(RecipeApiService);
  private layout = inject(LayoutService);
  private mealStore = inject(MealStoreService);
  private ingredientStore = inject(IngredientStoreService);

  private _recipes = signal<Recipe[]>([]);
  recipes = this._recipes.asReadonly();

  private _currentRecipe = signal<Recipe | null>(null);
  currentRecipe = this._currentRecipe.asReadonly();

  async loadRecipes(): Promise<void> {
    this.layout.startLoading();
    try {
      const apiRecipes = await firstValueFrom(this.api.getRecipes());
      this._recipes.set(
        apiRecipes
          .map((r) => fromApiRecipe(r, this.ingredientStore.ingredients()))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch (err) {
      this.layout.setError('Error al cargar recetas');
    } finally {
      this.layout.stopLoading();
    }
  }

  async loadRecipesByMeal(mealId: string): Promise<void> {
    this.layout.startLoading();
    try {
      const allRecipes = this._recipes();
      const filtered = allRecipes
        .filter((r) => r.meals?.some((id) => id === mealId))
        .sort((a, b) => a.name.localeCompare(b.name));
      this._recipes.set(filtered);

    } catch (err) {
      this.layout.setError('Error al cargar recetas');
    } finally {
      this.layout.stopLoading();
    }
  }

  async loadRecipe(recipeId: string, mealId: string): Promise<void> {
    this.layout.startLoading();
    try {
      
      const recipe = this._recipes().find((r) => r.id === recipeId);
      
      if (!recipe) throw new Error('Receta no encontrada');
      
      // cargar meal para ajustar macros
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
      this.layout.toast('Error al cargar la receta', '', 'error');
    } finally {
      this.layout.stopLoading();
    }
  }

  async saveRecipe(recipe: Recipe): Promise<void> {
    this.layout.startLoading();
    try {
      const savedApiRecipe = await firstValueFrom(
        this.api.updateRecipe(recipe)
      );

      const allIngredients: Ingredient[] = this.ingredientStore.ingredients();
      const savedRecipe = fromApiRecipe(savedApiRecipe, allIngredients);

      // actualizar lista
      this._recipes.update((recipes) =>
        recipes.some((r) => r.id === savedRecipe.id)
          ? recipes.map((r) => (r.id === savedRecipe.id ? savedRecipe : r))
          : [...recipes, savedRecipe]
      );

      // 🔑 refrescar también el currentRecipe para que la vista lo note
      this._currentRecipe.set(savedRecipe);

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
