import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of } from 'rxjs';

export const homeGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  let router = inject(Router);
  return authService.isAuthenticated().pipe(map(isLoggedIn => {
    if (isLoggedIn) {
      return router.parseUrl('admin');
    }
    return true;
  }));
};
