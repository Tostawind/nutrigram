import { Ingredient } from '../models/ingredient.model';
import { Macros } from '../models/macros.model';

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

export function scaleMacros(ingredient: Ingredient, grams: number): Macros {
  const factor = grams / ingredient.portion;
  return {
    protein: +(ingredient.macros.protein * factor).toFixed(2),
    carbs: +(ingredient.macros.carbs * factor).toFixed(2),
    fat: +(ingredient.macros.fat * factor).toFixed(2),
    kcal: +(ingredient.macros.kcal * factor).toFixed(2),
  };
}

export function adjustIngredientsToTarget(
  ingredients: Ingredient[],
  targetMacros: Macros,
  focus: keyof Macros = 'carbs',
  iterations = 5
): Ingredient[] {
  // Creamos copias de los ingredientes para no modificar los originales
  let adjustedIngredients = ingredients.map(ing => ({
    ...ing,
    portion: ing.portion,
    macros: { ...ing.macros }
  }));

  for (let i = 0; i < iterations; i++) {
    // Ajuste por macro prioritario
    const totalFocus = adjustedIngredients.reduce(
      (sum, ing) => sum + ing.macros[focus],
      0
    );
    const factorFocus = totalFocus > 0 ? targetMacros[focus] / totalFocus : 1;
    adjustedIngredients.forEach(item => {
      item.portion *= factorFocus;
      item.macros = scaleMacros(item, item.portion);
    });

    // Ajuste proporcional para los otros macros
    (['protein', 'carbs', 'fat', 'kcal'] as (keyof Macros)[]).forEach(macro => {
      if (macro === focus) return;
      const totalMacro = adjustedIngredients.reduce((sum, ing) => sum + ing.macros[macro], 0);
      const factor = totalMacro > 0 ? targetMacros[macro] / totalMacro : 1;
      adjustedIngredients.forEach(item => {
        item.portion *= factor;
        item.macros = scaleMacros(item, item.portion);
      });
    });
  }

  return adjustedIngredients;
}
