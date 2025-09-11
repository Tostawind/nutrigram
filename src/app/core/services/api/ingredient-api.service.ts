import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { Recipe } from '../../models/recipe.model';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class IngredientApiService {
  private supabase = inject(SupabaseService);

  getIngredients(
    category?: 'protein' | 'carbs' | 'fat'
  ): Observable<Ingredient[]> {
    return from(
      (async () => {
        let query = this.supabase.supabase.from('ingredients').select('*');
        if (category) {
          query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (error) throw error;
        return (data ?? []) as Ingredient[];
      })()
    );
  }

  updateIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return from(
      (async () => {
        let response;
        if (ingredient.id) {
          response = await this.supabase.supabase
            .from('ingredients')
            .update(ingredient)
            .eq('id', ingredient.id)
            .select()
            .single();
        } else {
          response = await this.supabase.supabase
            .from('ingredients')
            .insert(ingredient)
            .select()
            .single();
        }

        const { data, error } = response;
        if (error) throw error;
        return data as Ingredient;
      })()
    );
  }

  deleteIngredient(id: string): Observable<void> {
    return from(
      (async () => {
        const { error } = await this.supabase.supabase
          .from('ingredients')
          .delete()
          .eq('id', id);

        if (error) throw error;
      })()
    );
  }

  getRecipesUsingIngredient(ingredientId: string): Observable<Recipe[]> {
    return from(
      (async () => {
        const { data, error } = await this.supabase.supabase
          .from('recipes')
          .select('*')
          .contains('ingredients', [ingredientId]);

        if (error) throw error;
        return (data ?? []) as Recipe[];
      })()
    );
  }
}
