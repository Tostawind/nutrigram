import { Ingredient } from '../models/ingredient.model';
import { Macros } from '../models/macros.model';
import solver, { Solve } from 'javascript-lp-solver';

export function calculateCalories(
  proteinGrams: number,
  carbGrams: number,
  fatGrams: number
): number {
  return proteinGrams * 4 + carbGrams * 4 + fatGrams * 9;
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

  // Modelo
  const model: any = {
    optimize: 'kcal', // minimizar distancia a kcal
    opType: 'min',
    constraints: {
      protein: {
        min: targetMacros.protein * 0.95,
        max: targetMacros.protein * 1.05,
      },
      carbs: {
        min: targetMacros.carbs * 0.95,
        max: targetMacros.carbs * 1.05,
      },
      fat: {
        min: targetMacros.fat * 0.95,
        max: targetMacros.fat * 1.05,
      },
    },
    variables: {},
    ints: {},
  };

  // Variables dinámicas según ingredientes
  ingredients.forEach((ing, idx) => {
    model.variables[ing.name] = {
      protein: macrosPerGram[idx].macros.protein,
      carbs: macrosPerGram[idx].macros.carbs,
      fat: macrosPerGram[idx].macros.fat,
      kcal: macrosPerGram[idx].macros.kcal,
    };

    model.ints[ing.name] = 1;

    // límite máximo genérico (opcional)
    model.constraints[ing.name] = { max: 500 };
  });

  // Resolver
  const results = solver.Solve(model);

  // Reconstrucción de receta
  const recipe = ingredients.map((ing) => {
    const val = results[ing.name];
    const g = Math.max(0, Math.round(typeof val === 'number' ? val : 0));
    const macros = {
      protein: Math.round((ing.macros.protein / ing.portion) * g),
      carbs: Math.round((ing.macros.carbs / ing.portion) * g),
      fat: Math.round((ing.macros.fat / ing.portion) * g),
      kcal: Math.round((ing.macros.kcal / ing.portion) * g),
    };
    return {
      ...ing,
      portion: g,
      macros,
    };
  });

  // Totales
  const total: Macros = recipe.reduce(
    (acc, ing) => {
      acc.protein += ing.macros.protein;
      acc.carbs += ing.macros.carbs;
      acc.fat += ing.macros.fat;
      acc.kcal += ing.macros.kcal;
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0, kcal: 0 }
  );

  return {
    ingredients: recipe,
    total,
  };
}
