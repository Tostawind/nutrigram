import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { CardModule } from 'primeng/card';
import { MealService } from '../../core/services/meal.service';
import { MACROS_DEFAULT } from '../../core/constants/macros';
import { RecipeService } from '../../core/services/recipe.service';


@Component({
  selector: 'app-recipes',
  imports: [MacrosTableComponent, RouterLink, CardModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  mealService = inject(MealService);
  recipeService = inject(RecipeService);

  macrosDefault = MACROS_DEFAULT;
  mealId: string = '';
  ngOnInit() {
    this.mealId = this.route.snapshot.paramMap.get('mealId') || '';


    this.mealService.getMeal(this.mealId);
    this.recipeService.getRecipesByMeal(this.mealId);
  }
}
