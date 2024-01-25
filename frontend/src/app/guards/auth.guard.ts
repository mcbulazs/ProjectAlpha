import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  let auth = inject(AuthService);
  let router = inject(Router);
  return auth.isAuthenticated().pipe(map(res => {
    if(res) return true;
    router.navigate(['/']);
    return false;
  }));
};
