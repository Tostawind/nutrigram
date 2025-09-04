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

  async getMeals(): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      const result = await firstValueFrom(this._http.get<Meal[]>(MEALS));
      this._meals.set(result);
      this._layoutService.hideSplashScreen();
    } catch (err) {
      this._layoutService.toast(
        'Error',
        'No se pudieron cargar las comidas',
        'error'
      );
      this._layoutService.showSplashScreen(
        'error',
        'No se pudieron cargar las comidas'
      );
    }
  }

  async getMeal(mealId: string): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      const result = await firstValueFrom(
        this._http.get<Meal>(MEAL_BY_ID(mealId))
      );
      this._currentMeal.set(result);
      this._layoutService.hideSplashScreen();
    } catch (err) {
      this._layoutService.toast(
        'Error',
        `No se pudo cargar la comida: ${mealId}`,
        'error'
      );
      this._layoutService.showSplashScreen(
        'error',
        'No se pudo cargar la comida'
      );
    }
  }

  async updateMeal(meal: Meal): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      const updated = await firstValueFrom(
        this._http.put<Meal>(MEAL_BY_ID(meal.id), meal)
      );
      this._meals.set(
        this._meals()?.map((m) => (m.id === updated.id ? updated : m)) || []
      );
      this._layoutService.hideSplashScreen();
    } catch (err) {
      this._layoutService.toast(
        'Error',
        `Error al actualizar la comida ${meal.name}`,
        'error'
      );
      this._layoutService.showSplashScreen(
        'error',
        'No se pudieron actualizar las comidas'
      );
    }
  }
}
