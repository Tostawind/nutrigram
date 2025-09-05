import { Component, inject, OnInit, signal } from '@angular/core';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MACROS_DEFAULT } from '../../core/constants/macros';
import { IngredientsTableComponent } from '../../shared/components/ingredients-table/ingredients-table.component';
import { ButtonModule } from 'primeng/button';
import { RecipeFormDialogComponent } from '../../shared/components/recipe-form-dialog/recipe-form-dialog.component';
import { RecipeStoreService } from '../../core/services/stores/recipe-store.service';
import { MealStoreService } from '../../core/services/stores/meal-store.service';

@Component({
  selector: 'app-recipe',
  imports: [
    MacrosTableComponent,
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
  recipeStore = inject(RecipeStoreService);
  mealStore = inject(MealStoreService);

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
    await this.recipeStore.loadRecipe(this.recipeId, this.mealId);
  }

  async deleteRecipe() {
    const deleteConfirm = confirm('Seguro que quieres eliminar receta?');
    if (!deleteConfirm) return;

    await this.recipeStore.deleteRecipe(this.recipeId);
    this._router.navigate(['/']);
  }
}
