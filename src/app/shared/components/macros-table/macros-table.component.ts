import { Component, Input, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Macros } from '../../../core/models/macros.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { MACROS, MacrosKey } from '../../../core/constants/macros';
@Component({
  selector: 'app-macros-table',
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    FloatLabel,
  ],
  templateUrl: './macros-table.component.html',
  styleUrl: './macros-table.component.scss',
})
export class MacrosTableComponent {
  @Input() editableFields: MacrosKey[] = [];

  modal = signal({
    isVisible: false,
    label: '',
    field: '' as MacrosKey | '',
    value: '',
  });

  macros: Macros[] = [
    {
      kcal: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    },
  ];

  columns = [
    { key: 'kcal' as MacrosKey, label: 'Kcal', unit: 'kcal' },
    { key: 'protein' as MacrosKey, label: 'P', unit: 'g' },
    { key: 'carbs' as MacrosKey, label: 'H', unit: 'g' },
    { key: 'fats' as MacrosKey, label: 'G', unit: 'g' },
  ];

  getMacrosKeys(key: MacrosKey): string {
    return MACROS[key];
  }

  editCell(field: MacrosKey, value: string): void {
    if (!this.editableFields.includes(field)) return;

    this.modal.set({
      isVisible: true,
      label: this.getMacrosKeys(field),
      field,
      value: value.toString(),
    });
  }

  saveCell(): void {
    const m = this.modal();
    if (m.field) {
      this.macros[0][m.field] = Number(m.value);
    }
    this.modal.update((modal) => ({ ...modal, isVisible: false }));
  }
}
