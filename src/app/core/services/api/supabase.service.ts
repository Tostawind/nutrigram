import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Meal } from '../../models/meal.model';
import { Settings } from '../../models/settings.model';
import { Recipe, RecipeApi } from '../../models/recipe.model';
import { Ingredient } from '../../models/ingredient.model';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  public readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://mmehysyjxtqcewxndlhn.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZWh5c3lqeHRxY2V3eG5kbGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMjUwNjYsImV4cCI6MjA3MjkwMTA2Nn0.9BqSJbBJf9Q78_FHDhCDFZ77WLfzUZqrwqcpY140Khk'
    );
  }

  async getMeals() {
    return this.supabase
      .from('meals')
      .select('*')
      .order('order', { ascending: true });
  }

  async updateMeal(meal: Meal) {
    return this.supabase
      .from('meals')
      .update({ name: meal.name, macros: meal.macros })
      .eq('id', meal.id)
      .select() // 👈 muy importante para que devuelva el registro actualizado
      .single(); // 👈 devuelve solo un objeto
  }

  async getSettings(): Promise<Settings> {
    const { data, error } = await this.supabase
      .from('settings')
      .select('*')
      .maybeSingle(); // 👈 devuelve objeto único o null

    if (error) throw error;

    // Si no hay configuración, devolvemos valores por defecto
    return (
      data ?? {
        macros: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
      }
    );
  }

  async updateSettings(macros: Settings['macros']): Promise<Settings> {
    // 👇 en este ejemplo asumo que tienes solo un registro en settings
    const { data: existing, error: getError } = await this.supabase
      .from('settings')
      .select('*')
      .maybeSingle();

    if (getError) throw getError;

    if (!existing) {
      // Insertar si no existe
      const { data, error } = await this.supabase
        .from('settings')
        .insert({ macros })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Actualizar si existe
    const { data, error } = await this.supabase
      .from('settings')
      .update({ macros })
      .eq('id', existing.id) // 👈 importante: WHERE por id
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // --- RECIPES ---
  // Obtener todas las recetas
  getRecipes() {
    return this.supabase.from('recipes').select('*');
  }

  // Obtener recetas que contienen un mealId
  getRecipesByMeal(mealId: string) {
    return this.supabase
      .from('recipes')
      .select('*')
      .contains('meals', [mealId]);
  }

  // Obtener receta por id
  getRecipe(recipeId: string) {
    return this.supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();
  }

  upsertRecipe(recipe: RecipeApi) {
    if (recipe.id) {
      return this.supabase
        .from('recipes')
        .update(recipe)
        .eq('id', recipe.id)
        .select()
        .single();
    } else {
      return this.supabase.from('recipes').insert(recipe).select().single();
    }
  }

  // Eliminar receta
  deleteRecipe(recipeId: string) {
    return this.supabase.from('recipes').delete().eq('id', recipeId);
  }

  // --- INGREDIENTS ---
  getIngredients() {
    return this.supabase.from('ingredients').select('*');
  }

  getIngredientsByCategory(category: 'protein' | 'carbs' | 'fat') {
    return this.supabase
      .from('ingredients')
      .select('*')
      .eq('category', category);
  }

  upsertIngredient(ingredient: Ingredient) {
    if (ingredient.id) {
      return this.supabase
        .from('ingredients')
        .update(ingredient)
        .eq('id', ingredient.id)
        .select()
        .single();
    } else {
      return this.supabase
        .from('ingredients')
        .insert(ingredient)
        .select()
        .single();
    }
  }

  deleteIngredient(id: string) {
    return this.supabase.from('ingredients').delete().eq('id', id);
  }

  getRecipesUsingIngredient(ingredientId: string) {
    return this.supabase
      .from('recipes')
      .select('*')
      .contains('ingredients', [ingredientId]);
  }
}

