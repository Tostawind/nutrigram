import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Settings } from '../../models/settings.model';
import { SETTINGS } from '../../constants/api';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
  private http = inject(HttpClient);
  private supabaseService = inject(SupabaseService);

  getSettings(): Observable<Settings> {
    return from(this.supabaseService.getSettings());
  }

  updateSettings(newSettings: Settings): Observable<Settings> {
    return from(this.supabaseService.updateSettings(newSettings.macros));
  }
}
