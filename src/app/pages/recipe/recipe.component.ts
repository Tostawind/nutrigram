import { Component, inject, OnInit } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';
import { MACROS_DEFAULT } from '../../core/constants/macros';

@Component({
  selector: 'app-recipe',
  imports: [MacrosTableComponent],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  recipeService = inject(RecipeService);

  macrosDefault = MACROS_DEFAULT;

  ngOnInit(): void {
    const recipeId = this._route.snapshot.paramMap.get('recipeId') || '';

    this.recipeService.getRecipe(recipeId);
  }
}
