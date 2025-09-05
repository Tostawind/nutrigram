import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { CardModule } from 'primeng/card';
import { MACROS_DEFAULT } from '../../core/constants/macros';
import { RecipeStoreService } from '../../core/services/stores/recipe-store.service';
import { MealStoreService } from '../../core/services/stores/meal-store.service';


@Component({
  selector: 'app-recipes',
  imports: [MacrosTableComponent, RouterLink, CardModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  mealStore = inject(MealStoreService);
  recipeStore = inject(RecipeStoreService);

  macrosDefault = MACROS_DEFAULT;
  mealId: string = '';
  ngOnInit() {
    this.mealId = this.route.snapshot.paramMap.get('mealId') || '';


    this.mealStore.loadMeal(this.mealId);
    this.recipeStore.loadRecipesByMeal(this.mealId);
  }
}
