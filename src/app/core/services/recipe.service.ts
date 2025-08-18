import { inject, Injectable, signal } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const API_URL = 'http://localhost:3000/recipes';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private _http = inject(HttpClient);

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
      const result = await firstValueFrom(this._http.get<Recipe[]>(API_URL));
      this._recipes.set(result);
    } catch (err) {
      this._error.set('No se pudieron cargar las recetas');
    } finally {
      this._loading.set(false);
    }
  }

  async getRecipe(recipeId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const result = await firstValueFrom(
        this._http.get<Recipe>(`${API_URL}/${recipeId}`)
      );
      this._currentRecipe.set(result);
    } catch (err) {
      this._error.set('No se pudo cargar la receta');
    } finally {
      this._loading.set(false);
    }
  }
}
