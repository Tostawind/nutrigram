import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { LayoutService } from '../layout.service';
import { IngredientApiService } from '../api/ingredient-api.service';

@Injectable({ providedIn: 'root' })
export class IngredientStoreService {
  private api = inject(IngredientApiService);
  private layout = inject(LayoutService);

  // Fuente unica de verdad:
  private _ingredients = signal<Ingredient[]>([]);

  // Derivados:
  readonly ingredients = computed(() => this._ingredients());
  readonly proteinIngredients = computed(() =>
    this._ingredients().filter((i) => i.category === 'protein')
  );
  readonly carbsIngredients = computed(() =>
    this._ingredients().filter((i) => i.category === 'carbs')
  );
  readonly fatIngredients = computed(() =>
    this._ingredients().filter((i) => i.category === 'fat')
  );

  async loadIngredients(): Promise<void> {
    this.layout.startLoading();
    try {
      const response = await firstValueFrom(this.api.getIngredients());
      this._ingredients.set(response);
    } catch {
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

      this._ingredients.update((list) => this._replaceOrAdd(list, updated));

      this.layout.toast('Ingrediente guardado', updated.name, 'success');
    } catch {
      this.layout.toast('No se pudo guardar el ingrediente', '', 'error');
    } finally {
      this.layout.stopLoading();
    }
  }

  async deleteIngredient(id: string): Promise<void> {
    this.layout.startLoading();
    try {
      // 1️⃣ Comprobar si el ingrediente se usa en alguna receta
      const recipes = await firstValueFrom(
        this.api.getRecipesUsingIngredient(id)
      );

      if (recipes.length > 0) {
        const recipeNames = recipes.map((r) => r.name).join(', ');
        this.layout.toast(
          'No se puede eliminar el ingrediente',
          `Está usado en las recetas: ${recipeNames}`,
          'error'
        );
        return; // Salimos sin eliminar
      }

      // 2️⃣ Si no se usa, eliminar ingrediente
      await firstValueFrom(this.api.deleteIngredient(id));

      this._ingredients.update((list) => list.filter((i) => i.id !== id));

      this.layout.toast('Ingrediente eliminado', '', 'success');
    } catch {
      this.layout.toast('No se pudo eliminar el ingrediente', '', 'error');
    } finally {
      this.layout.stopLoading();
    }
  }

  // 🔹 helper para reemplazar o agregar
  private _replaceOrAdd(list: Ingredient[], updated: Ingredient): Ingredient[] {
    const index = list.findIndex((i) => i.id === updated.id);
    if (index > -1) {
      const clone = [...list];
      clone[index] = updated;
      return clone;
    }
    return [...list, updated];
  }
}
