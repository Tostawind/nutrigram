import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Settings } from '../../models/settings.model';
import { SETTINGS } from '../../constants/api';

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
  private http = inject(HttpClient);

  getSettings(): Observable<Settings> {
    return this.http.get<Settings>(SETTINGS);
  }

  updateSettings(newSettings: Settings): Observable<Settings> {
    return this.http.put<Settings>(SETTINGS, newSettings);
  }
}
