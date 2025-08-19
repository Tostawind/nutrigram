import { Component, inject, OnInit } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';
import { MACROS_DEFAULT } from '../../core/constants/macros';
import { Ingredient } from '../../core/models/ingredient.model';

@Component({
  selector: 'app-recipe',
  imports: [MacrosTableComponent],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  recipeService = inject(RecipeService);

  macros = MACROS_DEFAULT;

  ngOnInit(): void {
    this.loadRecipe();
  }

  async loadRecipe() {
    const recipeId = this._route.snapshot.paramMap.get('recipeId') || '';
    await this.recipeService.getRecipe(recipeId);
    this.macros = this.calculteTotalMacros(this.recipeService.currentRecipe()?.ingredients || []);
  }

  calculteTotalMacros(ingredients: Ingredient[]): any {
    return ingredients.reduce((acc, ingredient) => {
      acc.kcal += ingredient.macros.kcal;
      acc.protein += ingredient.macros.protein;
      acc.carbs += ingredient.macros.carbs;
      acc.fat += ingredient.macros.fat;
      return acc;
    }, { ...this.macros });
  }
}
