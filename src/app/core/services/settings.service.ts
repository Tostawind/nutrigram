import { Injectable } from '@angular/core';
import { SETTINGS } from '../constants/settings';
import { Settings } from '../models/settings.model';
import { Meal } from '../models/meal.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  getSettings(): Settings {
    return SETTINGS;
  }

  getMealById(mealId: string): Meal | null {
    const meal = SETTINGS.meals.find((meal) => meal.id === mealId) || null;
    return meal;
  }
}
