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
