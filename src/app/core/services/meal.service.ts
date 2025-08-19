import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Meal } from '../models/meal.model';
import { MEAL_BY_ID, MEALS } from '../constants/api';
import { LayoutService } from './layout.service';


@Injectable({
  providedIn: 'root',
})
export class MealService {
  private _http = inject(HttpClient);
  private _layoutService = inject(LayoutService);

  private _meals = signal<Meal[]>([]);
  meals = this._meals.asReadonly();

  private _currentMeal = signal<Meal | null>(null);
  currentMeal = this._currentMeal.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  async getMeals(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const result = await firstValueFrom(this._http.get<Meal[]>(MEALS));
      this._meals.set(result);
    } catch (err) {
      this._error.set('No se pudieron cargar las comidas');
      this._layoutService.toast('Error', 'No se pudieron cargar las comidas', 'error');
    } finally {
      this._loading.set(false);
    }
  }

  async getMeal(mealId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const result = await firstValueFrom(this._http.get<Meal>(MEAL_BY_ID(mealId)));
      this._currentMeal.set(result);
    } catch (err) {
      this._error.set('No se pudo cargar la comida');
      this._layoutService.toast('Error', `No se pudo cargar la comida: ${mealId}`, 'error');

    } finally {
      this._loading.set(false);
    }
  }

  async updateMeal(meal: Meal): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const updated = await firstValueFrom(
        this._http.put<Meal>(MEAL_BY_ID(meal.id), meal)
      );
      this._meals.set(this._meals()?.map(m => m.id === updated.id ? updated : m) || []);
    } catch (err) {
      this._error.set('No se pudieron actualizar las comidas');
      this._layoutService.toast('Error', `Error al actualizar la comida ${meal.name}`, 'error');
    } finally {
      this._loading.set(false);
    }
  }
}
