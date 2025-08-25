import { Component, inject, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { MealService } from '../../../core/services/meal.service';
import { Meal } from '../../../core/models/meal.model';
import { LayoutService } from '../../../core/services/layout.service';
import { Ingredient } from '../../../core/models/ingredient.model';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IngredientService } from '../../../core/services/ingredient.service';

@Component({
  selector: 'app-recipe-form-dialog',
  imports: [
    DialogModule,
    InputTextModule,
    FormsModule,
    RadioButtonModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
  ],
  templateUrl: './recipe-form-dialog.component.html',
  styleUrl: './recipe-form-dialog.component.scss',
})
export class RecipeFormDialogComponent {
  private _mealService = inject(MealService);
  private _ingredientService = inject(IngredientService);
  private _layoutService = inject(LayoutService);

  visible = model(false);

  meals: Meal[] = [];

  filteredIngredients: {
    protein: Ingredient[];
    carbs: Ingredient[];
    fat: Ingredient[];
  } = {
    protein: [],
    carbs: [],
    fat: [],
  };

  ingredients: {
    protein: Ingredient[];
    carbs: Ingredient[];
    fat: Ingredient[];
  } = {
    protein: [],
    carbs: [],
    fat: [],
  };

  // Form:
  name: string = '';
  selectedMeal: Meal | null = null;
  selectedIngredients: {
    protein: Ingredient[];
    carbs: Ingredient[];
    fat: Ingredient[];
  } = {
    protein: [],
    carbs: [],
    fat: [],
  };

  ngOnInit() {
    this.loadMeals();
  }

  async loadMeals() {
    await this._mealService.getMeals();
    this.meals = this._mealService.meals();
    await this.loadIngredients();
  }

  async loadIngredients() {
    await this._ingredientService.getIngredients('protein');
    this.ingredients.protein = this._ingredientService.proteinIngredients();
    await this._ingredientService.getIngredients('carbs');
    this.ingredients.carbs = this._ingredientService.carbsIngredients();
    await this._ingredientService.getIngredients('fat');
    this.ingredients.fat = this._ingredientService.fatIngredients();
  }

  filterIngredients(event: { query: string }, category: 'protein' | 'carbs' | 'fat') {
    const query = event.query.toLowerCase();
    this.filteredIngredients[category] = this.ingredients[category].filter((ingredient) =>
      ingredient.name.toLowerCase().includes(query)
    );
  }

  validateForm(): boolean {
    return this.name.trim() !== '' && this.selectedMeal !== null;
  }

  save() {
    if (this.validateForm()) {
      console.log('Saving recipe:', {
        name: this.name,
        meal: this.selectedMeal,
        ingredients: [
          ...this.selectedIngredients.protein,
          ...this.selectedIngredients.carbs,
          ...this.selectedIngredients.fat,
        ],
      });
      this._layoutService.toast(
        'Campos correctos',
        'Todos los campos son correctos',
        'success'
      );
    } else {
      this._layoutService.toast(
        'Campos incorrectos',
        'Por favor, completa todos los campos requeridos',
        'error'
      );
    }
  }
}
