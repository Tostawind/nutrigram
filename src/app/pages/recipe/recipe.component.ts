import { Component, inject, OnInit, signal } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';
import { MACROS_DEFAULT } from '../../core/constants/macros';
import { MealService } from '../../core/services/meal.service';
import { StatusSpinnerComponent } from '../../shared/components/status-spinner/status-spinner.component';
import { IngredientsTableComponent } from '../../shared/components/ingredients-table/ingredients-table.component';
import { ButtonModule } from 'primeng/button';
import { RecipeFormDialogComponent } from '../../shared/components/recipe-form-dialog/recipe-form-dialog.component';

@Component({
  selector: 'app-recipe',
  imports: [
    MacrosTableComponent,
    StatusSpinnerComponent,
    IngredientsTableComponent,
    ButtonModule,
    RecipeFormDialogComponent,
  ],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent implements OnInit {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  recipeService = inject(RecipeService);
  mealService = inject(MealService);

  isDialogVisible = signal(false);

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

  async deleteRecipe() {
    const deleteConfirm = confirm('Seguro que quieres eliminar receta?');
    if (!deleteConfirm) return;

    await this.recipeService.deleteRecipe(this.recipeId);
    this._router.navigate(['/']);
  }
}
