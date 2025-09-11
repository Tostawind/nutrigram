import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Recipe, RecipeApi } from '../../models/recipe.model';
import { SupabaseService } from './supabase.service';
import { toApiRecipe } from '../../adapters/recipe.adapter';

@Injectable({ providedIn: 'root' })
export class RecipeApiService {
  private supabase = inject(SupabaseService);

  getRecipesByMeal(mealId: string): Observable<RecipeApi[]> {
    return from(
      this.supabase.getRecipesByMeal(mealId).then((res) => {
        const { data, error } = res;
        if (error) throw error;
        return data as RecipeApi[];
      })
    );
  }

  getRecipe(recipeId: string): Observable<RecipeApi> {
    return from(
      this.supabase.getRecipe(recipeId).then((res) => {
        const { data, error } = res;
        if (error) throw error;
        if (!data) throw new Error('Receta no encontrada');
        return data as RecipeApi;
      })
    );
  }

  updateRecipe(recipe: Recipe): Observable<RecipeApi> {
    const apiRecipe: RecipeApi = toApiRecipe(recipe); // 👈 convierte a RecipeApi

    return from(
      this.supabase.upsertRecipe(apiRecipe).then(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('No se pudo guardar la receta');
        return data as RecipeApi; // 👈 tipamos correctamente
      })
    );
  }

  deleteRecipe(recipeId: string): Observable<void> {
    return from(
      this.supabase.deleteRecipe(recipeId).then(({ error }) => {
        if (error) throw error;
      })
    );
  }
}
