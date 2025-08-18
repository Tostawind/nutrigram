import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Meal } from '../models/meal.model';

const API_URL = 'http://localhost:3000/meals';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private _http = inject(HttpClient);

  private _meals = signal<Meal[]>([]);
  meals = this._meals.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  async getMeals(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const result = await firstValueFrom(this._http.get<Meal[]>(API_URL));
      this._meals.set(result);
    } catch (err) {
      this._error.set('No se pudieron cargar las comidas');
    } finally {
      this._loading.set(false);
    }
  }

  async updateMeal(meal: Meal): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const updated = await firstValueFrom(
        this._http.put<Meal>(`${API_URL}/${meal.id}`, meal)
      );
      this._meals.set(this._meals()?.map(m => m.id === updated.id ? updated : m) || []);
    } catch (err) {
      this._error.set('No se pudieron actualizar las comidas');
    } finally {
      this._loading.set(false);
    }
  }
}
