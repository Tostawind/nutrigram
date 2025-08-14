export interface Settings {
  macros: {
    kcal: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Array<{
    id: string;
    name: string;
    macros: {
      kcal: number;
      protein: number;
      carbs: number;
      fats: number;
    };
  }>;
}
