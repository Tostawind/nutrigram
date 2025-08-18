import { inject, Injectable, signal } from '@angular/core';
import { Settings } from '../models/settings.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const API_URL = 'http://localhost:3000/settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private _http = inject(HttpClient);

  private _settings = signal<Settings | null>(null);
  settings = this._settings.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  async getSettings(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const result = await firstValueFrom(this._http.get<Settings>(API_URL));
      this._settings.set(result);
    } catch (err) {
      this._error.set('No se pudieron cargar los ajustes');
    } finally {
      this._loading.set(false);
    }
  }

  async updateSettings(newSettings: Settings): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const updated = await firstValueFrom(
        this._http.put<Settings>(API_URL, newSettings)
      );
      this._settings.set(updated);
    } catch (err) {
      this._error.set('No se pudieron actualizar los ajustes');
    } finally {
      this._loading.set(false);
    }
  }
}
