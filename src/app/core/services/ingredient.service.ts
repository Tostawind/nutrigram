import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { firstValueFrom } from 'rxjs';
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

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  async getIngredients(category?: 'protein' | 'carbs' | 'fat'): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      let response: Ingredient[];
      if (category) {
        response = await firstValueFrom(
          this._http.get<Ingredient[]>(INGREDIENTS_BY_CATEGORY(category))
        );
      } else {
        response = await firstValueFrom(
          this._http.get<Ingredient[]>(INGREDIENTS)
        );
      }

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
      this._error.set('Error loading ingredients');
    } finally {
      this._loading.set(false);
    }
  }

  async updateIngredient(ingredient: Ingredient): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      if (ingredient.id) {
        await firstValueFrom(
          this._http.put(INGREDIENTS + '/' + ingredient.id, ingredient)
        );
      } else {
        await firstValueFrom(this._http.post(INGREDIENTS, ingredient));
      }
    } catch (err) {
      this._error.set('No se pudo crear el ingrediente');
      this._layoutService.toast(
        'Error',
        'No se pudo crear el ingrediente',
        'error'
      );
    } finally {
      this._loading.set(false);
    }
  }

  async deleteIngredient(id: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      // 1️⃣ Buscar recetas que usan este ingrediente usando filter
      const recipesUsingIngredient: Recipe[] = await firstValueFrom(
        this._http.get<Recipe[]>(`${RECIPES}?ingredientId=${id}`)
      );


      if (recipesUsingIngredient.length > 0) {
        // 2️⃣ Si hay recetas, no eliminar y mostrar error
        const recipeNames = recipesUsingIngredient
          .map((r) => r.name)
          .join(', ');
        this._error.set(
          `No se puede eliminar. Ingrediente usado en: ${recipeNames}`
        );
        this._layoutService.toast(
          'Error',
          `No se puede eliminar. Ingrediente usado en: ${recipeNames}`,
          'error'
        );
      } else {
        // 3️⃣ Si no hay recetas, eliminar ingrediente
        await firstValueFrom(this._http.delete(`${INGREDIENTS}/${id}`));
        this._layoutService.toast(
          'Éxito',
          'Ingrediente eliminado correctamente',
          'success'
        );

        // // 4️⃣ Actualizar lista local
        // this._ingredients.set(this._ingredients().filter((i) => i.id !== id));
        // this._proteinIngredients.set(
        //   this._proteinIngredients().filter((i) => i.id !== id)
        // );
        // this._carbsIngredients.set(
        //   this._carbsIngredients().filter((i) => i.id !== id)
        // );
        // this._fatIngredients.set(
        //   this._fatIngredients().filter((i) => i.id !== id)
        // );
      }
    } catch (err) {
      this._error.set('No se pudo eliminar el ingrediente');
      this._layoutService.toast(
        'Error',
        'No se pudo eliminar el ingrediente',
        'error'
      );
    } finally {
      this._loading.set(false);
    }
  }
}
