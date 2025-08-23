import { Ingredient } from '../models/ingredient.model';
import { Macros } from '../models/macros.model';

export function calculateCalories(
  proteinGrams: number,
  carbGrams: number,
  fatGrams: number
): number {
  return proteinGrams * 4 + carbGrams * 4 + fatGrams * 9;
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
  targetMacros: Macros
): { ingredients: Ingredient[]; total: Macros } {
  // macros por gramo
  const macrosPerGram = ingredients.map((i) => ({
    name: i.name,
    macros: {
      protein: i.macros.protein / i.portion,
      carbs: i.macros.carbs / i.portion,
      fat: i.macros.fat / i.portion,
      kcal: i.macros.kcal / i.portion,
    },
  }));

  // Estado inicial
  let grams = ingredients.map(() => 50);

  function calcTotal(grams: number[]): Macros {
    const total: Macros = { protein: 0, carbs: 0, fat: 0, kcal: 0 };
    grams.forEach((g, idx) => {
      total.protein += macrosPerGram[idx].macros.protein * g;
      total.carbs += macrosPerGram[idx].macros.carbs * g;
      total.fat += macrosPerGram[idx].macros.fat * g;
      total.kcal += macrosPerGram[idx].macros.kcal * g;
    });
    return total;
  }

  function error(total: Macros): number {
    return (
      Math.abs(total.protein - targetMacros.protein) +
      Math.abs(total.carbs - targetMacros.carbs) +
      Math.abs(total.fat - targetMacros.fat) +
      Math.abs(total.kcal - targetMacros.kcal) / 10 // kcal con menos peso
    );
  }

  let bestGrams = [...grams];
  let bestError = Infinity;

  // Búsqueda local
  for (let iter = 0; iter < 2000; iter++) {
    const idx = Math.floor(Math.random() * grams.length);
    const step = (Math.random() < 0.5 ? -1 : 1) * 5; // pasos de 5g
    const newGrams = [...grams];
    newGrams[idx] = Math.max(0, newGrams[idx] + step);

    const total = calcTotal(newGrams);
    const e = error(total);

    if (e < bestError) {
      bestError = e;
      bestGrams = newGrams;
    }

    if (e <= error(calcTotal(grams))) {
      grams = newGrams;
    }
  }

  // Redondear
  bestGrams = bestGrams.map((g) => Math.round(g));

  const total = calcTotal(bestGrams);

  const recipe = ingredients.map((ing, idx) => {
    const g = bestGrams[idx];
    const macros = {
      protein: Math.round(macrosPerGram[idx].macros.protein * g),
      carbs: Math.round(macrosPerGram[idx].macros.carbs * g),
      fat: Math.round(macrosPerGram[idx].macros.fat * g),
      kcal: Math.round(macrosPerGram[idx].macros.kcal * g),
    };
    return {
      ...ing,
      portion: g,
      macros,
    };
  });

  return {
    ingredients: recipe,
    total: {
      protein: Math.round(total.protein),
      carbs: Math.round(total.carbs),
      fat: Math.round(total.fat),
      kcal: Math.round(total.kcal),
    },
  };
}
