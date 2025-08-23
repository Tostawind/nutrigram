import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { MealService } from './core/services/meal.service';
import { Meal } from './core/models/meal.model';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    ButtonModule,
    RouterLink,
    Toast,
    DialogModule,
    InputTextModule,
    FloatLabel,
    RadioButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private _mealService = inject(MealService);

  visible: boolean = false;
  value2: string = '';
  meal: string = '';
  meals: Meal[] = [];
  selectedMeal: Meal | null = null;

  ngOnInit() {
    this.loadMeals();
  }

  async loadMeals() {
    await this._mealService.getMeals();
    this.meals = this._mealService.meals();
  }
}