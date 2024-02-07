import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of, switchMap } from 'rxjs';
import { PageDataService } from '../services/page.data.service';

export const authGuard: CanActivateFn = () => {
  let auth = inject(AuthService);
  let pds = inject(PageDataService);
  let router = inject(Router);

  return auth.isAuthenticated().pipe(
    switchMap(isAuthenticated => {
      if (isAuthenticated) {
        pds.webID = auth.webID;
        pds.getImages().subscribe();
        return pds.getData();
      }
      router.navigate(['/']);
      return of(false);
    }));
};
