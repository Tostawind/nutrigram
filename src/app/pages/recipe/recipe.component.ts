import { Component, inject, OnInit } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';
import { MACROS_DEFAULT } from '../../core/constants/macros';
import { MealService } from '../../core/services/meal.service';
import { StatusSpinnerComponent } from "../../shared/components/status-spinner/status-spinner.component";
import { IngredientsTableComponent } from "../../shared/components/ingredients-table/ingredients-table.component";

@Component({
  selector: 'app-recipe',
  imports: [MacrosTableComponent, StatusSpinnerComponent, IngredientsTableComponent],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  recipeService = inject(RecipeService);
  mealService = inject(MealService);

  recipeId = '';
  mealId = '';
  macrosDefault = MACROS_DEFAULT;

  ngOnInit(): void {
    this.loadRecipe();
  }

  async loadRecipe() {
    this.recipeId = this._route.snapshot.paramMap.get('recipeId') || '';
    this.mealId = this._route.snapshot.paramMap.get('mealId') || '';
    await this.recipeService.getRecipe(this.recipeId, this.mealId);
  }
}
