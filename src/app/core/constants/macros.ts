import { Macros } from '../models/macros.model';

export const MACROS = {
  kcal: 'Calorias',
  protein: 'Proteina',
  carbs: 'Hidratos',
  fats: 'Grasas',
};

export type MacrosKey = keyof typeof MACROS;

export const MACROS_DEFAULT: Macros = {
  kcal: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
};
