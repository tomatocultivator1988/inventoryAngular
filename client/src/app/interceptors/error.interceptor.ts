import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }

      const errorMessage = error.error?.error || error.message || 'An error occurred';
      console.error('[API Error]', errorMessage);

      return throwError(() => ({
        status: error.status,
        message: errorMessage
      }));
    })
  );
};
