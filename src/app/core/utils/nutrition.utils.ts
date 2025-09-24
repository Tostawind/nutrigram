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
  const glpk = await GLPK(); // macros por gramo (partiendo SIEMPRE de los ingredientes base)

  const macrosPerGram = ingredients.map((i) => ({
    name: i.name,
    macros: {
      protein: i.macros.protein / i.portion,
      carbs: i.macros.carbs / i.portion,
      fat: i.macros.fat / i.portion,
    },
  })); // Construir LP 

  // 📍 Aquí puedes añadir un console.log para ver los datos de entrada
  console.log('Entrada del LP:');
  console.log('Ingredientes por gramo:', macrosPerGram);
  console.log('Macros objetivo:', targetMacros);
  console.log('Rangos de macros (95%-105%):');
  console.log(
    `Proteína: ${targetMacros.protein * 0.95} - ${targetMacros.protein * 1.05}`
  );
  console.log(
    `Carbohidratos: ${targetMacros.carbs * 0.95} - ${targetMacros.carbs * 1.05}`
  );
  console.log(
    `Grasas: ${targetMacros.fat * 0.95} - ${targetMacros.fat * 1.05}`
  );

  const lp: any = {
    name: 'diet',
    objective: {
      direction: glpk.GLP_MIN,
      name: 'kcal',
      vars: ingredients.map((ing, idx) => ({
        name: ing.name,
        coef: calculateCalories(
          macrosPerGram[idx].macros.protein,
          macrosPerGram[idx].macros.carbs,
          macrosPerGram[idx].macros.fat
        ),
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
    ], // Se han eliminado las restricciones de `bounds` y `generals` // para permitir porciones decimales y simplificar el problema.
  }; // Resolver

  const rawResults = await glpk.solve(lp);
  const results = rawResults as unknown as GLPKResult; // Verificar el estado del resultado

  if (
    results.result.status !== glpk.GLP_OPT &&
    results.result.status !== glpk.GLP_FEAS
  ) {
    // Si no se encuentra una solución óptima o factible, devuelve cero.
    // Considera añadir un log o manejo de errores aquí.
    console.warn(
      'GLPK no pudo encontrar una solución. Estado:',
      results.result.status
    );
    const emptyResult = ingredients.map((ing) => ({
      ...ing,
      portion: 0,
      macros: { protein: 0, carbs: 0, fat: 0, kcal: 0 },
    }));
    return {
      ingredients: emptyResult,
      total: { protein: 0, carbs: 0, fat: 0, kcal: 0 },
    };
  } // Reconstrucción de receta

  const recipe = ingredients.map((ing) => {
    const g = Math.max(0, results.result.vars[ing.name] ?? 0);

    const protein = (ing.macros.protein / ing.portion) * g;
    const carbs = (ing.macros.carbs / ing.portion) * g;
    const fat = (ing.macros.fat / ing.portion) * g;

    const macros = {
      protein: protein,
      carbs: carbs,
      fat: fat,
      kcal: calculateCalories(protein, carbs, fat),
    };

    return {
      ...ing,
      portion: g,
      macros,
    };
  }); // Totales

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
