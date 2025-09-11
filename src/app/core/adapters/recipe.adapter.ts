import { Ingredient } from "../models/ingredient.model";
import { Recipe, RecipeApi } from "../models/recipe.model";

// Convierte de API a frontend
export function fromApiRecipe(
  apiRecipe: RecipeApi,
  allIngredients: Ingredient[]
): Recipe {
  return {
    ...apiRecipe,
    ingredients: apiRecipe.ingredients
      .map((id) => allIngredients.find((i) => i.id === id))
      .filter((i): i is Ingredient => !!i), // filtra undefined
  };
}

// Convierte de frontend a API
export function toApiRecipe(recipe: Recipe): RecipeApi {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((i) => i.id!).filter(Boolean),
  };
}
