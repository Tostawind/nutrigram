import { Meal } from '../models/meal.model';
import { Settings } from '../models/settings.model';

export const SETTINGS: Settings = {
  macros: {
    kcal: 2000,
    protein: 140,
    carbs: 170,
    fats: 70,
  },
  // meals: [
  //   {
  //     id: 'desayuno',
  //     name: '☀️ Desayuno',
  //     macros: { kcal: 400, protein: 25, carbs: 40, fats: 15 },
  //   },
  //   {
  //     id: 'comida',
  //     name: '🍽️ Comida',
  //     macros: { kcal: 600, protein: 40, carbs: 50, fats: 20 },
  //   },
  //   {
  //     id: 'cena',
  //     name: '🌕 Cena',
  //     macros: { kcal: 400, protein: 25, carbs: 35, fats: 15 },
  //   },
  //   {
  //     id: 'snack',
  //     name: '🍫 Snack',
  //     macros: { kcal: 300, protein: 25, carbs: 25, fats: 10 },
  //   },
  //   {
  //     id: 'snack2',
  //     name: '🍌 Snack 2',
  //     macros: { kcal: 300, protein: 25, carbs: 25, fats: 10 },
  //   },
  // ] as Meal[],
};
