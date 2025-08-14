export interface Meal {
  id: string | null;
  name: string;
  macros: {
    kcal: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}
