import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MEALS } from '../../core/constants/meals';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';
import { CardModule } from 'primeng/card';
import { Recipe } from '../../core/models/recipe.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recipes',
  imports: [MacrosTableComponent, RouterLink, CardModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent implements OnInit {
  mealId: string | null = null;
  mealTitle: string = 'Meal';
  recipes: Recipe[] = [];
  private _route = inject(ActivatedRoute);
  private _http = inject(HttpClient);
  ngOnInit() {
    this.mealId = this._route.snapshot.paramMap.get('mealId');
    this.mealTitle =
      MEALS.find((meal) => meal.id === this.mealId)?.name || 'Meal';

    this._http.get<Recipe[]>(`data/recipes.json`).subscribe((recipes) => {
      this.recipes = recipes;
    });
  }
}
