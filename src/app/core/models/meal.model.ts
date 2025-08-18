export interface Meal {
  id: string;
  name: string;
  macros: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
