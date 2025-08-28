import { Macros } from './macros.model';

export interface Ingredient {
  id: string | undefined;
  name: string;
  portion: number;
  unit: 'g' | 'ml' | 'u';
  macros: Macros;
  category: 'protein' | 'carbs' | 'fat';
  notes?: string;
}
