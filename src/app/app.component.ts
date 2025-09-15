import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { RecipeFormDialogComponent } from "./shared/components/recipe-form-dialog/recipe-form-dialog.component";
import { SplashScreenComponent } from "./shared/components/splash-screen/splash-screen.component";
import { SettingsStoreService } from './core/services/stores/settings-store.service';
import { MealStoreService } from './core/services/stores/meal-store.service';
import { RecipeStoreService } from './core/services/stores/recipe-store.service';
import { IngredientStoreService } from './core/services/stores/ingredient-store.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    RouterLink,
    RouterLinkActive,
    Toast,
    RecipeFormDialogComponent,
    SplashScreenComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  settingsStore = inject(SettingsStoreService);
  mealStore = inject(MealStoreService);
  recipeStore = inject(RecipeStoreService);
  ingredientStore = inject(IngredientStoreService);

  isRecipeDialogVisible = signal(false);

  ngOnInit(): void {
    this._loadInitialData();
  }

  private async _loadInitialData(): Promise<void> {
    await this.settingsStore.loadSettings();
    await this.mealStore.loadMeals();
    await this.ingredientStore.loadIngredients();
    await this.recipeStore.loadRecipes();
  }
}
