import { Macros } from './macros.model';

export interface Ingredient {
  id: string;
  name: string;
  portion: number;
  unit: 'g' | 'ml' | 'u';
  macros: Macros;
  notes?: string;
}
