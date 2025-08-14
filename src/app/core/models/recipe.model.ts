export interface Recipe {
  id: string;
  name: string;
  ingredients: string[]; // Aray of ingredient IDs
  notes?: string;
}
