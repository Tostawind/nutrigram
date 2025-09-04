import { inject, Injectable, signal } from '@angular/core';
import { Settings } from '../models/settings.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SETTINGS } from '../constants/api';
import { LayoutService } from './layout.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private _http = inject(HttpClient);
  private _layoutService = inject(LayoutService);

  private _settings = signal<Settings | null>(null);
  settings = this._settings.asReadonly();

  async getSettings(): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      const result = await firstValueFrom(this._http.get<Settings>(SETTINGS));
      this._settings.set(result);
      this._layoutService.hideSplashScreen();
    } catch (err) {
      this._layoutService.toast('Error', 'Error al cargar los ajustes', 'error');
      this._layoutService.showSplashScreen('error', 'Error al cargar los ajustes');

    }
  }

  async updateSettings(newSettings: Settings): Promise<void> {
    this._layoutService.showSplashScreen('loading');

    try {
      const updated = await firstValueFrom(
        this._http.put<Settings>(SETTINGS, newSettings)
      );
      this._settings.set(updated);
      this._layoutService.hideSplashScreen();
    } catch (err) {
      this._layoutService.toast('Error', 'Error al actualizar los ajustes', 'error');
      this._layoutService.toast('Error', 'Error al actualizar los ajustes', 'error');
    }
  }
}
