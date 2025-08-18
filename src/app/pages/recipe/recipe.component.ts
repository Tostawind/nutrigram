import { Component, inject, OnInit } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { Macros } from '../../core/models/macros.model';
import { Ingredient } from '../../core/models/ingredient.model';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-recipe',
  imports: [MacrosTableComponent],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _settingsService = inject(SettingsService);

  recipeName: string = 'Receta de ejemplo';
  macros: Macros = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  ingredients: Ingredient[] = [];

  ngOnInit(): void {
    const recipeId = this._route.snapshot.paramMap.get('recipeId') || '';

    // this.recipeName = this._settingsService.getRecipeById(recipeId);
  }
}
