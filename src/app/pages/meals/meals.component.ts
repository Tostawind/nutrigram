import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { MEALS } from '../../core/constants/meals';
import { MacrosTableComponent } from '../../shared/components/macros-table/macros-table.component';

@Component({
  selector: 'app-meals',
  imports: [CardModule, RouterLink, MacrosTableComponent],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss',
})
export class MealsComponent {
  meals = MEALS;
}
