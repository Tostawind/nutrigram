import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { INGREDIENTS_BY_CATEGORY, INGREDIENTS, RECIPES } from '../constants/api';
import { LayoutService } from './layout.service';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private _http = inject(HttpClient);
  private _layoutService = inject(LayoutService);

  private _ingredients = signal<Ingredient[]>([]);
  ingredients = this._ingredients.asReadonly();

  private _proteinIngredients = signal<Ingredient[]>([]);
  private _carbsIngredients = signal<Ingredient[]>([]);
  private _fatIngredients = signal<Ingredient[]>([]);

  proteinIngredients = this._proteinIngredients.asReadonly();
  carbsIngredients = this._carbsIngredients.asReadonly();
  fatIngredients = this._fatIngredients.asReadonly();

  async getIngredients(category?: 'protein' | 'carbs' | 'fat'): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      const response = await lastValueFrom(
        category
          ? this._http.get<Ingredient[]>(INGREDIENTS_BY_CATEGORY(category))
          : this._http.get<Ingredient[]>(INGREDIENTS)
      );

      switch (category) {
        case 'protein':
          this._proteinIngredients.set(response);
          break;
        case 'carbs':
          this._carbsIngredients.set(response);
          break;
        case 'fat':
          this._fatIngredients.set(response);
          break;
        default:
          this._ingredients.set(response);
      }
    } catch (error) {
      this._layoutService.toast('Error', 'Error al cargar ingredientes', 'error');
      this._layoutService.showSplashScreen('error', 'Error al cargar ingredientes');
    }
  }

  async updateIngredient(ingredient: Ingredient): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      if (ingredient.id) {
        await lastValueFrom(
          this._http.put(`${INGREDIENTS}/${ingredient.id}`, ingredient)
        );
      } else {
        await lastValueFrom(this._http.post(INGREDIENTS, ingredient));
      }
    } catch (err) {
      this._layoutService.toast('Error', 'No se pudo guardar el ingrediente', 'error');
      this._layoutService.showSplashScreen('error', 'No se pudo guardar el ingrediente');
    }
  }

  async deleteIngredient(id: string): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      // 1️⃣ Buscar recetas que usan este ingrediente
      const recipesUsingIngredient = await lastValueFrom(
        this._http.get<Recipe[]>(`${RECIPES}?ingredientId=${id}`)
      );

      if (recipesUsingIngredient.length > 0) {
        // 2️⃣ Si está en uso, error
        const recipeNames = recipesUsingIngredient.map((r) => r.name).join(', ');
        this._layoutService.toast(
          'Error',
          `No se puede eliminar. Ingrediente usado en: ${recipeNames}`,
          'error'
        );
        this._layoutService.showSplashScreen(
          'error',
          `No se puede eliminar. Ingrediente usado en: ${recipeNames}`
        );
      } else {
        // 3️⃣ Eliminar ingrediente
        await lastValueFrom(this._http.delete(`${INGREDIENTS}/${id}`));
        this._layoutService.toast('Éxito', 'Ingrediente eliminado correctamente', 'success');
      }
    } catch (err) {
      this._layoutService.toast('Error', 'No se pudo eliminar el ingrediente', 'error');
      this._layoutService.showSplashScreen('error', 'No se pudo eliminar el ingrediente');
    }
  }
}
