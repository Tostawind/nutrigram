import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Meal } from '../models/meal.model';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  readonly http = inject(HttpClient);

  private _apiUrl = 'http://localhost:3000/meals';

  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(this._apiUrl);
  }

  updateMeal(meal: Meal): Observable<Meal> {
    return this.http.put<Meal>(`${this._apiUrl}/${meal.id}`, meal);
  }
}
