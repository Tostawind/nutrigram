import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-meals',
  imports: [CardModule, RouterLink],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss',
})
export class MealsComponent {
  meals = [
    { id: 1, name: '☀️ Desayuno' },
    { id: 2, name: '🍽️ Comida' },
    { id: 3, name: '🌕 Cena' },
    { id: 4, name: '🍫 Snack' },
    { id: 5, name: '🍌 Snack 2' },
  ];
}
