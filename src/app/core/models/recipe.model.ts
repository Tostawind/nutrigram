import { Ingredient } from "./ingredient.model";
import { Macros } from "./macros.model";

export interface Recipe {
  id?: string;
  name: string;
  ingredients: Ingredient[];
  notes?: string;
  meals: string[];
  totalMacros?: Macros;
}

// --- API ---
export interface RecipeApi {
  id?: string;
  name: string;
  ingredients: string[]; // solo ids
  notes?: string;
  meals: string[];
}