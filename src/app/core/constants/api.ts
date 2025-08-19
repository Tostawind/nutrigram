const API_URL = 'http://localhost:3007';

// SETTINGS
export const SETTINGS = `${API_URL}/settings`;

// INGREDIENTS
export const INGREDIENTS = `${API_URL}/ingredients`;

// RECIPES
export const RECIPES = `${API_URL}/recipes`;
export const RECIPE_BY_ID = (recipeId: string) => `${API_URL}/recipes/${recipeId}`;

// MEALS
export const MEALS = `${API_URL}/meals`;
export const MEAL_BY_ID = (mealId: string) => `${API_URL}/meals/${mealId}`;

