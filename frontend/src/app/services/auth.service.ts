import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { PageDataService } from './page.data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private pds: PageDataService) {}

  webID: number = -1;
  isLoggedIn: boolean = false;

  isAuthenticated(): Observable<boolean> {
    if (this.isLoggedIn) return of(true);
    return this.httpClient.get<any>(`${environment.backendURL}/auth`, { withCredentials: true }).pipe(
      map(res => {
        if (res.webid) {
          this.webID = res.webid;
          this.isLoggedIn = true;
          console.log("WebID:", this.webID);
          return this.isLoggedIn = true;
        }
        return false;
      })
    );
  }

  register(user: any) {
    return this.httpClient.post(`${environment.backendURL}/register`, {
      email: user.email.toLowerCase(),
      password: user.password,
    }, {
      withCredentials: true
    });
  }

  login(user: User): Observable<any> {
    return this.httpClient.post(`${environment.backendURL}/login`, {
      email: user.email.toLowerCase(),
      password: user.password,
    }, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.httpClient.get(`${environment.backendURL}/logout`, {
      withCredentials: true,
    }).pipe(map(res => {
      this.isLoggedIn = false;
      this.webID = -1
      this.pds.init = true;
      return res;
    }));
  }
  
}
