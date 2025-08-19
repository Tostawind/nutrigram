import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Ingredient } from '../../../core/models/ingredient.model';

@Component({
  selector: 'app-ingredients-table',
  imports: [TableModule],
  templateUrl: './ingredients-table.component.html',
  styleUrl: './ingredients-table.component.scss'
})
export class IngredientsTableComponent {
  ingredients = input<Ingredient[]>([]);

  columns = [
    { key: 'name', label: 'Ingrediente', unit: '' },
    { key: 'portion', label: 'Gramos', unit: 'g' },
    { key: 'kcal', label: 'Kcal', unit: 'kcal' },
    { key: 'protein', label: 'P', unit: 'g' },
    { key: 'carbs', label: 'H', unit: 'g' },
    { key: 'fat', label: 'G', unit: 'g' },
  ];
}
