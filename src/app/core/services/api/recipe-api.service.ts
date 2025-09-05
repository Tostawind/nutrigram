import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../../models/recipe.model';
import { RECIPES, RECIPE_BY_ID } from '../../constants/api';

@Injectable({ providedIn: 'root' })
export class RecipeApiService {
  private http = inject(HttpClient);

  getRecipesByMeal(mealId: string): Observable<Recipe[]> {
    const params = new HttpParams().set('meal', mealId);
    return this.http.get<Recipe[]>(RECIPES, { params });
  }

  getRecipe(recipeId: string): Observable<Recipe> {
    return this.http.get<Recipe>(RECIPE_BY_ID(recipeId));
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    if (recipe.id) {
      return this.http.put<Recipe>(`${RECIPES}/${recipe.id}`, recipe);
    } else {
      return this.http.post<Recipe>(RECIPES, recipe);
    }
  }

  deleteRecipe(recipeId: string): Observable<void> {
    return this.http.delete<void>(`${RECIPES}/${recipeId}`);
  }
}
