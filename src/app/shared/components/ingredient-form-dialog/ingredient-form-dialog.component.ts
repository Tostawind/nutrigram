import { Component, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Ingredient } from '../../../core/models/ingredient.model';
import { Macros } from '../../../core/models/macros.model';
import { LayoutService } from '../../../core/services/layout.service';
import { MACROS_DEFAULT } from '../../../core/constants/macros';
import { InputNumberModule } from 'primeng/inputnumber';
import { IngredientStoreService } from '../../../core/services/stores/ingredient-store.service';

@Component({
  selector: 'app-ingredient-form-dialog',
  imports: [
    DialogModule,
    InputTextModule,
    FormsModule,
    RadioButtonModule,
    ButtonModule,
    InputNumberModule,
  ],
  templateUrl: './ingredient-form-dialog.component.html',
  styleUrl: './ingredient-form-dialog.component.scss',
})
export class IngredientFormDialogComponent {
  private _ingredientStore = inject(IngredientStoreService);
  private _layoutService = inject(LayoutService);

  ingredient = input<Ingredient | null>(null);

  visible = model(false);

  categories = [
    { id: 'protein', name: 'Proteína' },
    { id: 'carbs', name: 'Hidratos' },
    { id: 'fat', name: 'Grasas' },
  ];

  // Form
  name: string = '';
  selectedCategory: { id: string; name: string } | null = null;
  macros: Macros = MACROS_DEFAULT;
  notes: string = '';

  ngOnInit() {
    this.loadIngredient();
  }

  loadIngredient() {
    // New ingredient:
    if (!this.ingredient()) return;

    // Update ingredient:
    this.name = this.ingredient()?.name || '';
    this.selectedCategory =
      this.categories.find((c) => c.id === this.ingredient()?.category) || null;
    this.macros = this.ingredient()?.macros || MACROS_DEFAULT;
    this.notes = this.ingredient()?.notes || '';
  }

  validateForm(): boolean {
    return this.name.trim() !== '' && this.selectedCategory !== null;
  }

  async save() {
    if (this.validateForm()) {
      const ingredientToSave: Ingredient = {
        id: this.ingredient() ? this.ingredient()?.id : undefined,
        name: this.name,
        category: this.selectedCategory?.id as 'protein' | 'carbs' | 'fat',
        macros: this.macros,
        notes: this.notes,
        portion: 100,
        unit: 'g',
      };

      await this._ingredientStore.saveIngredient(ingredientToSave);

      this.resetForm();
      this.visible.set(false);

      this._layoutService.toast(
        'Ingrediente actualizado',
        'El ingrediente se ha actualizado correctamente',
        'success'
      );
      window.location.reload();

      this.resetForm();
      this.visible.set(false);

      this._layoutService.toast(
        'Campos correctos',
        'Todos los campos son correctos',
        'success'
      );
      window.location.reload();
    } else {
      this._layoutService.toast(
        'Campos incorrectos',
        'Por favor, completa todos los campos requeridos',
        'error'
      );
    }
  }

  resetForm() {
    this.name = '';
    this.selectedCategory = null;
    this.macros = MACROS_DEFAULT;
    this.notes = '';
  }

  async deleteIngredient() {
    const deleteConfirm = confirm('Seguro que quieres eliminar el ingrediente?');
    if (!deleteConfirm) return;

    await this._ingredientStore.deleteIngredient(this.ingredient()?.id || '');
    window.location.href = '/ingredients';
  }
}
