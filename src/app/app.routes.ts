import { Routes } from '@angular/router';
import { MealsComponent } from './pages/meals/meals.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
export const routes: Routes = [
  {
    path: '',
    component: MealsComponent,
  },
  {
    path: 'recipes/:recipeId',
    component: RecipesComponent,
  },
];
