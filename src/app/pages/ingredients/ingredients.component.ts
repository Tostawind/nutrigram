import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IngredientFormDialogComponent } from "../../shared/components/ingredient-form-dialog/ingredient-form-dialog.component";
import { IngredientService } from '../../core/services/ingredient.service';
import { TabsModule } from 'primeng/tabs';
import { Ingredient } from '../../core/models/ingredient.model';

@Component({
  selector: 'app-ingredients',
  imports: [ButtonModule, IngredientFormDialogComponent, TabsModule],
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.scss',
})
export class IngredientsComponent implements OnInit {
  ingredientService = inject(IngredientService);

  isIngredientDialogVisible = signal(false);
  ingredientToEdit = signal<Ingredient | null>(null);

  tabs: { label: string; value: string; content: Ingredient[] }[] = [];

  ngOnInit() {
    this._loadIngredients();
  }

  private async _loadIngredients() {
    await this.ingredientService.getIngredients('protein');
    await this.ingredientService.getIngredients('carbs');
    await this.ingredientService.getIngredients('fat');
    this.tabs = [
      {
        label: 'P',
        value: '0',
        content: this.ingredientService.proteinIngredients(),
      },
      {
        label: 'HC',
        value: '1',
        content: this.ingredientService.carbsIngredients(),
      },
      {
        label: 'G',
        value: '2',
        content: this.ingredientService.fatIngredients(),
      },
    ];
  }

  editIngredient(ingredient: Ingredient) {
    this.ingredientToEdit.set(ingredient);
    this.isIngredientDialogVisible.set(true);
  }
}
