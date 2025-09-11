import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IngredientFormDialogComponent } from "../../shared/components/ingredient-form-dialog/ingredient-form-dialog.component";
import { TabsModule } from 'primeng/tabs';
import { Ingredient } from '../../core/models/ingredient.model';
import { IngredientStoreService } from '../../core/services/stores/ingredient-store.service';

@Component({
  selector: 'app-ingredients',
  imports: [ButtonModule, IngredientFormDialogComponent, TabsModule],
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.scss',
})
export class IngredientsComponent implements OnInit {
  ingredientStore = inject(IngredientStoreService);

  isIngredientDialogVisible = signal(false);
  ingredientToEdit = signal<Ingredient | null>(null);

  tabs: { label: string; value: string; content: Ingredient[] }[] = [];

  ngOnInit() {
    this._loadIngredients();
  }

  private async _loadIngredients() {
    await this.ingredientStore.loadIngredients('protein');
    await this.ingredientStore.loadIngredients('carbs');
    await this.ingredientStore.loadIngredients('fat');

  }

  editIngredient(ingredient: Ingredient) {
    this.ingredientToEdit.set(ingredient);
    this.isIngredientDialogVisible.set(true);
  }
}
