import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { Recipe } from '../../models/recipe.model';
import {
  INGREDIENTS,
  INGREDIENTS_BY_CATEGORY,
  RECIPES,
} from '../../constants/api';

@Injectable({ providedIn: 'root' })
export class IngredientApiService {
  private http = inject(HttpClient);

  getIngredients(
    category?: 'protein' | 'carbs' | 'fat'
  ): Observable<Ingredient[]> {
    if (category) {
      return this.http.get<Ingredient[]>(INGREDIENTS_BY_CATEGORY(category));
    } else {
      return this.http.get<Ingredient[]>(INGREDIENTS);
    }
  }

  updateIngredient(ingredient: Ingredient): Observable<Ingredient> {
    if (ingredient.id) {
      return this.http.put<Ingredient>(
        `${INGREDIENTS}/${ingredient.id}`,
        ingredient
      );
    } else {
      return this.http.post<Ingredient>(INGREDIENTS, ingredient);
    }
  }

  deleteIngredient(id: string): Observable<void> {
    return this.http.delete<void>(`${INGREDIENTS}/${id}`);
  }

  getRecipesUsingIngredient(ingredientId: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${RECIPES}?ingredientId=${ingredientId}`);
  }
}
