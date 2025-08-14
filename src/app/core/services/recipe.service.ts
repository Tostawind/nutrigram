import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  getRecipesByMealId(mealId: string): Recipe[] {
    return [];
  }
}
