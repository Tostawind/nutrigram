import { Routes } from '@angular/router';
import { MealsComponent } from './pages/meals/meals.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
export const routes: Routes = [
  {
    path: '',
    component: MealsComponent,
  },
  {
    path: 'meals/:mealId',
    component: RecipesComponent,
  },
  {
    path: 'meals/:mealId/recipes/:recipeId',
    component: RecipeComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
];
