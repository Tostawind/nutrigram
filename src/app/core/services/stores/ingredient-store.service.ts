import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { LayoutService } from '../layout.service';
import { IngredientApiService } from '../api/ingredient-api.service';

@Injectable({ providedIn: 'root' })
export class IngredientStoreService {
  private api = inject(IngredientApiService);
  private layout = inject(LayoutService);

  private _ingredients = signal<Ingredient[]>([]);
  private _proteinIngredients = signal<Ingredient[]>([]);
  private _carbsIngredients = signal<Ingredient[]>([]);
  private _fatIngredients = signal<Ingredient[]>([]);

  ingredients = this._ingredients.asReadonly();
  proteinIngredients = this._proteinIngredients.asReadonly();
  carbsIngredients = this._carbsIngredients.asReadonly();
  fatIngredients = this._fatIngredients.asReadonly();

  async loadIngredients(category?: 'protein' | 'carbs' | 'fat'): Promise<void> {
    this.layout.startLoading();
    try {
      const response = await firstValueFrom(this.api.getIngredients(category));

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
    } catch (err) {
      this.layout.setError('Error al cargar ingredientes');
    } finally {
      this.layout.stopLoading();
    }
  }

  async saveIngredient(ingredient: Ingredient): Promise<void> {
    this.layout.startLoading();
    try {
      const updated = await firstValueFrom(
        this.api.updateIngredient(ingredient)
      );

      // actualizar listas según categoría
      switch (updated.category) {
        case 'protein':
          this._proteinIngredients.update((list) =>
            this._replaceOrAdd(list, updated)
          );
          break;
        case 'carbs':
          this._carbsIngredients.update((list) =>
            this._replaceOrAdd(list, updated)
          );
          break;
        case 'fat':
          this._fatIngredients.update((list) =>
            this._replaceOrAdd(list, updated)
          );
          break;
        default:
          this._ingredients.update((list) => this._replaceOrAdd(list, updated));
      }

      this.layout.toast('Ingrediente guardado', updated.name, 'success');
    } catch (err) {
      this.layout.setError('No se pudo guardar el ingrediente');
    } finally {
      this.layout.stopLoading();
    }
  }

  async deleteIngredient(id: string): Promise<void> {
    this.layout.startLoading();
    try {
      const recipesUsingIngredient = await firstValueFrom(
        this.api.getRecipesUsingIngredient(id)
      );

      if (recipesUsingIngredient.length > 0) {
        const recipeNames = recipesUsingIngredient
          .map((r) => r.name)
          .join(', ');

        this.layout.toast('No se puede eliminar', `Ingrediente usado en: ${recipeNames}`, 'error');

        return;
      }

      await firstValueFrom(this.api.deleteIngredient(id));

      // eliminar de todas las listas
      this._ingredients.update((list) => list.filter((i) => i.id !== id));
      this._proteinIngredients.update((list) =>
        list.filter((i) => i.id !== id)
      );
      this._carbsIngredients.update((list) => list.filter((i) => i.id !== id));
      this._fatIngredients.update((list) => list.filter((i) => i.id !== id));

      this.layout.toast('Ingrediente eliminado', '', 'success');
    } catch (err) {
      this.layout.toast('No se pudo eliminar el ingrediente', '', 'error');
    } finally {
      this.layout.stopLoading();
    }
  }

  private _replaceOrAdd(list: Ingredient[], updated: Ingredient): Ingredient[] {
    const index = list.findIndex((i) => i.id === updated.id);
    if (index >= 0) {
      list[index] = updated;
      return [...list];
    } else {
      return [...list, updated];
    }
  }
}
