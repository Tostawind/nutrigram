import { Ingredient } from '../models/ingredient.model';
import { Macros } from '../models/macros.model';
import GLPK from 'glpk.js';

// Tipado del resultado de glpk
interface GLPKResult {
  result: {
    vars: Record<string, number>;
    dual?: Record<string, number>;
    z: number;
    status: number;
  };
}

export function calculateCalories(
  proteinGrams: number,
  carbGrams: number,
  fatGrams: number
): number {
  return proteinGrams * 4 + carbGrams * 4 + fatGrams * 9;
}

export async function adjustIngredientsToTarget(
  ingredients: Ingredient[],
  targetMacros: Macros
): Promise<{ ingredients: Ingredient[]; total: Macros }> {
  const glpk = await GLPK();

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

  // Construir LP
  const lp: any = {
    name: 'diet',
    objective: {
      direction: glpk.GLP_MIN,
      name: 'kcal',
      vars: ingredients.map((ing, idx) => ({
        name: ing.name,
        coef: macrosPerGram[idx].macros.kcal,
      })),
    },
    subjectTo: [
      {
        name: 'protein',
        vars: ingredients.map((ing, idx) => ({
          name: ing.name,
          coef: macrosPerGram[idx].macros.protein,
        })),
        bnds: {
          type: glpk.GLP_DB,
          lb: targetMacros.protein * 0.95,
          ub: targetMacros.protein * 1.05,
        },
      },
      {
        name: 'carbs',
        vars: ingredients.map((ing, idx) => ({
          name: ing.name,
          coef: macrosPerGram[idx].macros.carbs,
        })),
        bnds: {
          type: glpk.GLP_DB,
          lb: targetMacros.carbs * 0.95,
          ub: targetMacros.carbs * 1.05,
        },
      },
      {
        name: 'fat',
        vars: ingredients.map((ing, idx) => ({
          name: ing.name,
          coef: macrosPerGram[idx].macros.fat,
        })),
        bnds: {
          type: glpk.GLP_DB,
          lb: targetMacros.fat * 0.95,
          ub: targetMacros.fat * 1.05,
        },
      },
    ],
  };

  // Resolver y tipar
  const rawResults = await glpk.solve(lp);
  const results = rawResults as unknown as GLPKResult;

  console.log('GLPK RAW RESULTS', results);

  // Reconstrucción de receta
  const recipe = ingredients.map((ing) => {
    // Access usando ['vars'] explícitamente
    const val = results.result['vars'][ing.name] ?? 0;
    const g = Math.max(0, Math.round(val));

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

  console.log('GLPK RESULT', recipe);

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

  return { ingredients: recipe, total };
}
