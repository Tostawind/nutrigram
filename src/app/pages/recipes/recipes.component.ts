import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MEALS } from '../../core/constants/meals';

@Component({
  selector: 'app-recipes',
  imports: [],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent implements OnInit {
  mealId: string | null = null;
  mealTitle: string = 'Meal';
  private _route = inject(ActivatedRoute);

  ngOnInit() {
    this.mealId = this._route.snapshot.paramMap.get('recipeId');
    this.mealTitle =
      MEALS.find((meal) => meal.id === this.mealId)?.name || 'Meal';
  }
}
