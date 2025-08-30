import { Routes } from '@angular/router';
import { MealsComponent } from './pages/meals/meals.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { IngredientsComponent } from './pages/ingredients/ingredients.component';
export const routes: Routes = [
  //_______________________________________________
  // MEALS:
  {
    path: '',
    component: MealsComponent,
  },
  //_______________________________________________
  // RECIPES:
  {
    path: 'meals/:mealId',
    component: RecipesComponent,
  },
  {
    path: 'meals/:mealId/recipes/:recipeId',
    component: RecipeComponent,
  },
  //_______________________________________________
  // INGREDIENTS:
  {
    path: 'ingredients',
    component: IngredientsComponent,
  },
  //_______________________________________________
  // SETTINGS:
  {
    path: 'settings',
    component: SettingsComponent,
  },
];
