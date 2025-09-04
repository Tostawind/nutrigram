import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Meal } from '../models/meal.model';
import { MEAL_BY_ID, MEALS } from '../constants/api';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private _http = inject(HttpClient);

  private _meals = signal<Meal[]>([]);
  meals = this._meals.asReadonly();

  private _currentMeal = signal<Meal | null>(null);
  currentMeal = this._currentMeal.asReadonly();

  async getMeals(): Promise<Meal[]> {
    const result = await firstValueFrom(this._http.get<Meal[]>(MEALS));
    this._meals.set(result);
    return result;
  }

  async getMeal(mealId: string): Promise<Meal> {
    const result = await firstValueFrom(this._http.get<Meal>(MEAL_BY_ID(mealId)));
    this._currentMeal.set(result);
    return result;
  }

  async updateMeal(meal: Meal): Promise<Meal> {
    const updated = await firstValueFrom(
      this._http.put<Meal>(MEAL_BY_ID(meal.id), meal)
    );

    // Actualiza la lista en memoria
    this._meals.set(
      this._meals()?.map((m) => (m.id === updated.id ? updated : m)) || []
    );

    // Si el currentMeal es el que se actualizó, lo sustituimos
    if (this._currentMeal()?.id === updated.id) {
      this._currentMeal.set(updated);
    }

    return updated;
  }
}
