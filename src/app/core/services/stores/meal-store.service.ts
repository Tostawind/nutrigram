import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LayoutService } from '../layout.service';
import { MealApiService } from '../api/meal-api.service';
import { Meal } from '../../models/meal.model';

@Injectable({ providedIn: 'root' })
export class MealStoreService {
  private api = inject(MealApiService);
  private layout = inject(LayoutService);

  private _meals = signal<Meal[]>([]);
  meals = this._meals.asReadonly();

  private _currentMeal = signal<Meal | null>(null);
  currentMeal = this._currentMeal.asReadonly();

  async loadMeals(): Promise<void> {
    this.layout.startLoading();

    try {
      const result = await firstValueFrom(this.api.getMeals());
      this._meals.set(result);
    } catch (err) {
      this.layout.setError('Error al cargar comidas');
    } finally {
      this.layout.stopLoading();
    }
  }

  async loadMeal(mealId: string): Promise<void> {
    this.layout.startLoading();

    try {
      const result = await firstValueFrom(this.api.getMeal(mealId));
      this._currentMeal.set(result);
    } catch (err) {
      this.layout.setError('Error al cargar la comida');
    } finally {
      this.layout.stopLoading();
    }
  }

  async updateMeal(meal: Meal): Promise<void> {
    this.layout.startLoading();

    try {
      const updated = await firstValueFrom(this.api.updateMeal(meal));

      this._meals.update((meals) =>
        meals.map((m) => (m.id === updated.id ? updated : m))
      );

      if (this._currentMeal()?.id === updated.id) {
        this._currentMeal.set(updated);
      }

      this.layout.toast('Comida actualizada', updated.name, 'success');
    } catch (err) {
      this.layout.setError('Error al actualizar comida');
    } finally {
      this.layout.stopLoading();
    }
  }
}
