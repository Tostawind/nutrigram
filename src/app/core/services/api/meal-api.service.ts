import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Meal } from '../../models/meal.model';
import { MEAL_BY_ID, MEALS } from '../../constants/api';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MealApiService {
  private http = inject(HttpClient);

  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(MEALS);
  }

  getMeal(mealId: string): Observable<Meal> {
    return this.http.get<Meal>(MEAL_BY_ID(mealId));
  }

  updateMeal(meal: Meal): Observable<Meal> {
    return this.http.put<Meal>(MEAL_BY_ID(meal.id), meal);
  }
}
