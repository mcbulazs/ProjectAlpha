import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';
import { PageDataService } from '../services/page.data.service';

export const authGuard: CanActivateFn = (route, state) => {
  let auth = inject(AuthService);
  let pds = inject(PageDataService);
  let router = inject(Router);
  return auth.isAuthenticated().pipe(map(res => {
    if(res) {
      pds.getData().subscribe();
      return true;
    }
    router.navigate(['/']);
    return false;
  }));
};
