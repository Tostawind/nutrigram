import { Ingredient } from "../models/ingredient.model";
import { Macros } from "../models/macros.model";

export function calculateCalories(
  proteinGrams: number,
  carbGrams: number,
  fatGrams: number
): number {
  return proteinGrams * 4 + carbGrams * 4 + fatGrams * 9;
}

export function calculateIngredientGrams(
  ingredient: Ingredient,
  targetMacros: Macros,
  focus: keyof Macros = 'carbs'
): number {
  const perPortion = ingredient.macros[focus];
  if (!perPortion || perPortion <= 0) return 0;

  return (targetMacros[focus] * ingredient.portion) / perPortion;
}


export function scaleMacros(
  ingredient: Ingredient,
  grams: number
): Macros {
  const factor = grams / ingredient.portion;
  return {
    protein: +(ingredient.macros.protein * factor).toFixed(2),
    carbs: +(ingredient.macros.carbs * factor).toFixed(2),
    fat: +(ingredient.macros.fat * factor).toFixed(2),
    kcal: +(ingredient.macros.kcal * factor).toFixed(2),
  };
}