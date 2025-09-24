import {
  adjustIngredientsToTarget,
  calculateCalories,
} from './nutrition.utils';
import { Ingredient } from '../models/ingredient.model';
import { Macros } from '../models/macros.model';
import { Meal } from '../models/meal.model';

// __________________________________________________
// MEALS
const meals: Meal[] = [
  {
    id: 'm001',
    name: 'Desayuno',
    macros: { kcal: 395, protein: 25, carbs: 40, fat: 15 },
  },
  {
    id: 'm002',
    name: 'Comida',
    macros: { kcal: 600, protein: 40, carbs: 50, fat: 20 },
  },
];

//___________________________________________________
// INGREDIENTES
// Proteinas
const quesoFrescoBatido: Ingredient = {
  id: 'i0007',
  name: 'Queso Fresco Batido',
  portion: 100,
  unit: 'g',
  macros: { protein: 8, fat: 3.5, carbs: 0.1, kcal: 46 },
  category: 'protein',
};

const atunNatural: Ingredient = {
  id: 'i0010',
  name: 'Atún al Natural (Mercadona 60g/lata)',
  portion: 100,
  unit: 'g',
  macros: { protein: 21, fat: 0.9, carbs: 1.2, kcal: 98 },
  category: 'protein',
};

// Hidratos
const avena: Ingredient = {
  id: 'i0015',
  name: 'Avena',
  portion: 100,
  unit: 'g',
  macros: { protein: 12, fat: 5.3, carbs: 56, kcal: 350 },
  category: 'carbs',
};

const arrozHervido: Ingredient = {
  id: 'i0012',
  name: 'Arroz Hervido',
  portion: 100,
  unit: 'g',
  macros: { protein: 3, fat: 1, carbs: 26, kcal: 123 },
  category: 'carbs',
};

// Grasas
const nueces: Ingredient = {
  id: 'i0023',
  name: 'Nueces',
  portion: 100,
  unit: 'g',
  macros: { protein: 15, fat: 65, carbs: 14, kcal: 654 },
  category: 'fat',
};

const mantequillaCacahuete: Ingredient = {
  id: 'i0028',
  name: 'Mantequilla de Cacahuete',
  portion: 100,
  unit: 'g',
  macros: { protein: 26, fat: 52, carbs: 11, kcal: 630 },
  category: 'fat',
};

const aceiteOliva: Ingredient = {
  id: 'i0025',
  name: 'Aceite de Oliva',
  portion: 100,
  unit: 'ml',
  macros: { protein: 0, fat: 100, carbs: 0, kcal: 900 },
  category: 'fat',
};

/* 
    # RECETA 1: Desayuno (queso fresco batido + avena + nueces)
    [Macros objetivo: P23, HC50, F11 | 347 kcal]

    - 200 g queso fresco batido
    - 50 g avena
    - 10 g nueces (4-5)  | 20 g choco 85% (2 onzas) | 15g crema cacahuete
*/

async function testDesayuno() {
  const ingredients = [quesoFrescoBatido, avena, nueces];
  const targetMacros: Macros = { protein: 23, carbs: 50, fat: 11, kcal: 347 };

  const result = await adjustIngredientsToTarget(ingredients, targetMacros);
  const total = result.total;

  const macrosDentroDeRango =
    total.protein >= targetMacros.protein * 0.95 &&
    total.protein <= targetMacros.protein * 1.05 &&
    total.carbs >= targetMacros.carbs * 0.95 &&
    total.carbs <= targetMacros.carbs * 1.05 &&
    total.fat >= targetMacros.fat * 0.95 &&
    total.fat <= targetMacros.fat * 1.05;

  let output = '--- Test: Receta Desayuno ---\n';
  output += 'Macros Objetivo:\n';
  output += `- Proteínas: ${targetMacros.protein}g\n`;
  output += `- Carbohidratos: ${targetMacros.carbs}g\n`;
  output += `- Grasas: ${targetMacros.fat}g\n`;
  output += '\nMacros Calculados:\n';
  output += `- Proteínas: ${total.protein.toFixed(2)}g\n`;
  output += `- Carbohidratos: ${total.carbs.toFixed(2)}g\n`;
  output += `- Grasas: ${total.fat.toFixed(2)}g\n`;
  output += '\nPorciones Calculadas:\n';
  result.ingredients.forEach((ing) => {
    output += `- ${ing.name}: ${ing.portion.toFixed(2)}g\n`;
  });
  output +=
    '\n¿Macros dentro del 5% del objetivo? ' +
    (macrosDentroDeRango ? '✅ SÍ' : '❌ NO');
  output += '\n-----------------------------------';

  console.log(output);
}



/* 
  # RECETA 2: Comida (arroz hervido + atún al natural + aceite de oliva)
  [Macros objetivo: P40, HC47, F17 | 497 kcal]

  - 180 g arroz hervido
  - 150 g Atún al natural
  - 14 g aceite oliva

*/
async function testComida() {
  const ingredients = [arrozHervido, atunNatural, aceiteOliva];
  const targetMacros: Macros = { protein: 40, carbs: 47, fat: 17, kcal: 497 };

  const result = await adjustIngredientsToTarget(ingredients, targetMacros);
  const total = result.total;

  const macrosDentroDeRango =
    total.protein >= targetMacros.protein * 0.95 &&
    total.protein <= targetMacros.protein * 1.05 &&
    total.carbs >= targetMacros.carbs * 0.95 &&
    total.carbs <= targetMacros.carbs * 1.05 &&
    total.fat >= targetMacros.fat * 0.95 &&
    total.fat <= targetMacros.fat * 1.05;

  let output = '--- Test: Receta Comida ---\n';
  output += 'Macros Objetivo:\n';
  output += `- Proteínas: ${targetMacros.protein}g\n`;
  output += `- Carbohidratos: ${targetMacros.carbs}g\n`;
  output += `- Grasas: ${targetMacros.fat}g\n`;
  output += '\nMacros Calculados:\n';
  output += `- Proteínas: ${total.protein.toFixed(2)}g\n`;
  output += `- Carbohidratos: ${total.carbs.toFixed(2)}g\n`;
  output += `- Grasas: ${total.fat.toFixed(2)}g\n`;
  output += '\nPorciones Calculadas:\n';
  result.ingredients.forEach((ing) => {
    output += `- ${ing.name}: ${ing.portion.toFixed(2)}g\n`;
  });
  output +=
    '\n¿Macros dentro del 5% del objetivo? ' +
    (macrosDentroDeRango ? '✅ SÍ' : '❌ NO');
  output += '\n-----------------------------------';

  console.log(output);
}

testDesayuno();
testComida();