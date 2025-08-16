import { inject, Injectable } from '@angular/core';
import { SETTINGS } from '../constants/settings';
import { Settings } from '../models/settings.model';
import { Meal } from '../models/meal.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  readonly http = inject(HttpClient);

  private _apiUrl = 'http://localhost:3000/settings';

  getSettings(): Observable<Settings> {
    return this.http.get<Settings>(this._apiUrl);
  }

  updateSettings(settings: Settings): Observable<Settings> {
    return this.http.put<Settings>(this._apiUrl, settings);
  }

  // TODO:
  getMealById(mealId: string): Meal | null {
    const meal = SETTINGS.meals.find((meal) => meal.id === mealId) || null;
    return meal;
  }
}
