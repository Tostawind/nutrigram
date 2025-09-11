import { inject, Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Meal } from '../../models/meal.model';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class MealApiService {
  private supabaseService = inject(SupabaseService);

  getMeals(): Observable<Meal[]> {
    return from(
      this.supabaseService.getMeals().then(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as Meal[];
      })
    );
  }

  getMeal(mealId: string): Observable<Meal> {
    return from(
      this.supabaseService.getMeals().then(({ data, error }) => {
        if (error) throw error;
        const meal = data?.find((m: Meal) => m.id === mealId);
        if (!meal) throw new Error('Meal no encontrado');
        return meal as Meal;
      })
    );
  }

  updateMeal(meal: Meal): Observable<Meal> {
    return from(
      this.supabaseService.updateMeal(meal).then(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Meal no encontrado');
        return data as Meal;
      })
    );
  }
}
