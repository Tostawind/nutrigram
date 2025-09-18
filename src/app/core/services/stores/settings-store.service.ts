import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Settings } from '../../models/settings.model';
import { LayoutService } from '../layout.service';
import { SettingsApiService } from '../api/settings-api.service';

@Injectable({ providedIn: 'root' })
export class SettingsStoreService {
  private api = inject(SettingsApiService);
  private layout = inject(LayoutService);

  private _settings = signal<Settings | null>(null);
  settings = this._settings.asReadonly();

  async loadSettings(): Promise<void> {
    this.layout.startLoading();
    try {
      const result = await firstValueFrom(this.api.getSettings());
      this._settings.set(result);
    } catch {
      this.layout.setError('Error al cargar configuración');
    } finally {
      this.layout.stopLoading();
    }
  }

  async updateSettings(newSettings: Settings): Promise<void> {
    this.layout.startLoading();
    try {
      const updated = await firstValueFrom(
        this.api.updateSettings(newSettings)
      );
      this._settings.set(updated);
      this.layout.toast('Configuración actualizada', '', 'success');
    } catch {
      this.layout.setError('Error al actualizar configuración');
    } finally {
      this.layout.stopLoading();
    }
  }
}
