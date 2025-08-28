import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { firstValueFrom } from 'rxjs';
import { INGREDIENTS_BY_CATEGORY, INGREDIENTS } from '../constants/api';
import { LayoutService } from './layout.service';

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
      const response = await firstValueFrom(
        this._http.get<Ingredient[]>(INGREDIENTS_BY_CATEGORY(category))
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
        await firstValueFrom(this._http.put(INGREDIENTS + '/' + ingredient.id, ingredient));
      } else {
        await firstValueFrom(this._http.post(INGREDIENTS, ingredient));
      }
    } catch (err) {
      this._error.set('No se pudo crear el ingrediente');
      this._layoutService.toast('Error', 'No se pudo crear el ingrediente', 'error');
    } finally {
      this._loading.set(false);
    }
  }
}
