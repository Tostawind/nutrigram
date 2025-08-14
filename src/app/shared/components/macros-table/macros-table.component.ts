import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Macros } from '../../../core/models/macros.model';

@Component({
  selector: 'app-macros-table',
  imports: [TableModule],
  templateUrl: './macros-table.component.html',
  styleUrl: './macros-table.component.scss',
})
export class MacrosTableComponent {
  macros: Macros[] = [
    {
      kcal: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    },
  ];
}
