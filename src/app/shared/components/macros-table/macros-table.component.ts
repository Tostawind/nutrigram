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

  modal = {
    isVisible: false,
    label: '',
    field: '' as MacrosKey,
    value: '',
  };

  macros: Macros[] = [
    {
      kcal: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    },
  ];

  getMacrosKeys(key: MacrosKey): string {
    return MACROS[key];
  }

  editCell(field: MacrosKey, value: string): void {
    if (!this.editableFields.includes(field)) {
      return;
    }

    this.modal = {
      isVisible: true,
      label: this.getMacrosKeys(field),
      field,
      value: value.toString(),
    };
  }

  saveCell(): void {
    const field = this.modal.field as MacrosKey;

    (this.macros[0] as any)[field] = Number(this.modal.value);

    this.modal.isVisible = false;
  }
}
