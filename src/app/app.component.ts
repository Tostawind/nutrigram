import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { RecipeFormDialogComponent } from "./shared/components/recipe-form-dialog/recipe-form-dialog.component";
import { IngredientFormDialogComponent } from './shared/components/ingredient-form-dialog/ingredient-form-dialog.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    RouterLink,
    Toast,
    RecipeFormDialogComponent,
    IngredientFormDialogComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isRecipeDialogVisible = signal(false);
  isIngredientDialogVisible = signal(false);
}
