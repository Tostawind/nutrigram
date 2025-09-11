import { Component, inject, input, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { Meal } from '../../../core/models/meal.model';
import { LayoutService } from '../../../core/services/layout.service';
import { Ingredient } from '../../../core/models/ingredient.model';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Recipe } from '../../../core/models/recipe.model';
import { IngredientStoreService } from '../../../core/services/stores/ingredient-store.service';
import { RecipeStoreService } from '../../../core/services/stores/recipe-store.service';
import { MealStoreService } from '../../../core/services/stores/meal-store.service';

@Component({
  selector: 'app-recipe-form-dialog',
  imports: [
    DialogModule,
    InputTextModule,
    FormsModule,
    RadioButtonModule,
    ButtonModule,
    AutoCompleteModule,
  ],
  templateUrl: './recipe-form-dialog.component.html',
  styleUrl: './recipe-form-dialog.component.scss',
})
export class RecipeFormDialogComponent {
  private _mealStore = inject(MealStoreService);
  private _ingredientStore = inject(IngredientStoreService);
  private _layoutService = inject(LayoutService);
  private _recipeStore = inject(RecipeStoreService);

  recipe = input<Recipe | null>(null);

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
    this.loadInit();
  }

  async loadInit() {
    await this.loadMeals();
    await this.loadIngredients();
    this.loadRecipe();
  }

  async loadMeals() {
    await this._mealStore.loadMeals();
    this.meals = this._mealStore.meals();
  }

  async loadIngredients() {
    await this._ingredientStore.loadIngredients('protein');
    this.ingredients.protein = this._ingredientStore.proteinIngredients();
    await this._ingredientStore.loadIngredients('carbs');
    this.ingredients.carbs = this._ingredientStore.carbsIngredients();
    await this._ingredientStore.loadIngredients('fat');
    this.ingredients.fat = this._ingredientStore.fatIngredients();
  }

  loadRecipe() {
    // New recipe:
    if (!this.recipe()) return;

    // Update recipe:
    this.name = this.recipe()?.name || '';
    this.selectedMeal = this.meals.find((meal) => meal.id === this.recipe()?.meals[0]) || null;
    this.selectedIngredients = {
      protein:
        this.recipe()?.ingredients.filter(
          (ingredient) => ingredient.category === 'protein'
        ) || [],
      carbs:
        this.recipe()?.ingredients.filter(
          (ingredient) => ingredient.category === 'carbs'
        ) || [],
      fat:
        this.recipe()?.ingredients.filter(
          (ingredient) => ingredient.category === 'fat'
        ) || [],
    };
  }

  filterIngredients(
    event: { query: string },
    category: 'protein' | 'carbs' | 'fat'
  ) {
    const query = event.query.toLowerCase();
    this.filteredIngredients[category] = this.ingredients[category].filter(
      (ingredient) => ingredient.name.toLowerCase().includes(query)
    );
  }

  validateForm(): boolean {
    return this.name.trim() !== '' && this.selectedMeal !== null;
  }

  async save() {
    if (this.validateForm()) {
      const recipeToSave: Recipe = {
        id: this.recipe() ? this.recipe()?.id : undefined,
        name: this.name,
        meals: this.selectedMeal?.id ? [this.selectedMeal?.id] : [],
        ingredients: [
          ...this.selectedIngredients.protein,
          ...this.selectedIngredients.carbs,
          ...this.selectedIngredients.fat,
        ],
      };
      await this._recipeStore.saveRecipe(recipeToSave);

      this.resetForm();
      this.visible.set(false);
      
    } else {
      this._layoutService.toast(
        'Campos incorrectos',
        'Por favor, completa todos los campos requeridos',
        'error'
      );
    }
  }

  resetForm() {
    this.name = '';
    this.selectedMeal = null;
    this.selectedIngredients = {
      protein: [],
      carbs: [],
      fat: [],
    };
  }
}
