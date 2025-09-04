import { inject, Injectable, signal } from '@angular/core';
import { Settings } from '../models/settings.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SETTINGS } from '../constants/api';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private _http = inject(HttpClient);

  private _settings = signal<Settings | null>(null);
  settings = this._settings.asReadonly();

  async getSettings(): Promise<Settings> {
    const result = await firstValueFrom(this._http.get<Settings>(SETTINGS));
    this._settings.set(result);
    return result;
  }

  async updateSettings(newSettings: Settings): Promise<Settings> {
    const updated = await firstValueFrom(
      this._http.put<Settings>(SETTINGS, newSettings)
    );
    this._settings.set(updated);
    return updated;
  }
}
