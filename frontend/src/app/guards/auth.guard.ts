import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, switchMap } from 'rxjs';
import { PageDataService } from '../services/page.data.service';

export const authGuard: CanActivateFn = (route, state) => {
  let auth = inject(AuthService);
  let pds = inject(PageDataService);
  let router = inject(Router);

  return auth.isAuthenticated().pipe(switchMap(res => {
    if(res) {
      if (pds.init) {
        pds.webID = auth.webID;
        return pds.getData().pipe(map(() => {
          return true;
        }));
      }
      return of(true);
    }
    router.navigate(['/']);
    return of(false);
  }));
};
