import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { RecipeFormDialogComponent } from "./shared/components/recipe-form-dialog/recipe-form-dialog.component";
import { SplashScreenComponent } from "./shared/components/splash-screen/splash-screen.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    RouterLink,
    RouterLinkActive,
    Toast,
    RecipeFormDialogComponent,
    SplashScreenComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isRecipeDialogVisible = signal(false);
}
