import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { LayoutService } from '../services/layout.service';

export const loadingErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const layout = inject(LayoutService);

  // 🚀 mostrar loading solo si la petición lo requiere
  layout.showSplashScreen('loading');

  return next(req).pipe(
    tap(() => {
      // ✅ en éxito: ocultamos
      layout.hideSplashScreen();
    }),
    catchError((err) => {
      // ❌ en error: mostramos error y NO ocultamos
      layout.showSplashScreen('error', 'Error en la petición');
      layout.toast('Error', 'No se pudo completar la operación', 'error');
      return throwError(() => err);
    })
    // ⛔️ importante: NO meter finalize con hideSplashScreen
  );
};