import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';

const API_URL = 'http://localhost:3000/ingredients';


@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private _http = inject(HttpClient);

  private _ingredients = signal<Ingredient[]>([]);
  ingredients = this._ingredients.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

}
