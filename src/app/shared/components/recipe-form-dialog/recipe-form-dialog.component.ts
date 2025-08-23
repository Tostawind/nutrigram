import { Component, inject, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { MealService } from '../../../core/services/meal.service';
import { Meal } from '../../../core/models/meal.model';

@Component({
  selector: 'app-recipe-form-dialog',
  imports: [
    DialogModule,
    InputTextModule,
    FloatLabel,
    FormsModule,
    RadioButtonModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './recipe-form-dialog.component.html',
  styleUrl: './recipe-form-dialog.component.scss',
})
export class RecipeFormDialogComponent {
  private _mealService = inject(MealService);

  visible = model(false);

  meals: Meal[] = [];
  
  // Form:
  name: string = '';
  selectedMeal: Meal | null = null;

  ngOnInit() {
    this.loadMeals();
  }

  async loadMeals() {
    await this._mealService.getMeals();
    this.meals = this._mealService.meals();
  }
}
