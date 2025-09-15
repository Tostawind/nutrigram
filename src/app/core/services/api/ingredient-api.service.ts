import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { Recipe } from '../../models/recipe.model';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class IngredientApiService {
  private supabase = inject(SupabaseService);

  getIngredients(): Observable<Ingredient[]> {
    return from(
      this.supabase.getIngredients().then(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as Ingredient[];
      })
    );
  }

  getIngredientsByCategory(
    category: 'protein' | 'carbs' | 'fat'
  ): Observable<Ingredient[]> {
    return from(
      this.supabase
        .getIngredientsByCategory(category)
        .then(({ data, error }) => {
          if (error) throw error;
          return (data ?? []) as Ingredient[];
        })
    );
  }

  updateIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return from(
      this.supabase.upsertIngredient(ingredient).then(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('No se pudo guardar el ingrediente');
        return data as Ingredient;
      })
    );
  }

  deleteIngredient(id: string): Observable<void> {
    return from(
      this.supabase.deleteIngredient(id).then(({ error }) => {
        if (error) throw error;
      })
    );
  }

  getRecipesUsingIngredient(ingredientId: string): Observable<Recipe[]> {
    return from(
      this.supabase
        .getRecipesUsingIngredient(ingredientId)
        .then(({ data, error }) => {
          if (error) throw error;
          return (data ?? []) as Recipe[];
        })
    );
  }
}
