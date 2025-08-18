import { Ingredient } from "./ingredient.model";

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  notes?: string;
}
