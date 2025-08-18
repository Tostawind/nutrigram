import { Component, signal, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Macros } from '../../../core/models/macros.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import {
  MACROS,
  MACROS_DEFAULT,
  MacrosKey,
} from '../../../core/constants/macros';

@Component({
  selector: 'app-macros-table',
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    InputNumberModule,
    FormsModule,
    FloatLabel,
  ],
  templateUrl: './macros-table.component.html',
  styleUrl: './macros-table.component.scss',
})
export class MacrosTableComponent {
  macros = input<Macros[]>([MACROS_DEFAULT]);
  editableFields = input<MacrosKey[]>([]);
  showDiffColors = input<boolean>(false);
  save = output<Macros[]>();

  modal = signal({
    isVisible: false,
    label: '',
    field: '' as MacrosKey | '',
    value: '',
  });

  columns = [
    { key: 'kcal' as MacrosKey, label: 'Kcal', unit: 'kcal' },
    { key: 'protein' as MacrosKey, label: 'P', unit: 'g' },
    { key: 'carbs' as MacrosKey, label: 'H', unit: 'g' },
    { key: 'fat' as MacrosKey, label: 'G', unit: 'g' },
  ];

  getMacrosKeys(key: MacrosKey): string {
    return MACROS[key];
  }

  editCell(field: MacrosKey, value: string): void {
    if (!this.editableFields().includes(field)) return;

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
      const newMacros = [...this.macros()];
      newMacros[0] = { ...newMacros[0], [m.field]: Number(m.value) };
      this.save.emit(newMacros);
    }
    this.modal.update((modal) => ({ ...modal, isVisible: false }));
  }
}
