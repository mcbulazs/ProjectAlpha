import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  webID: number = -1;
  isLoggedIn: boolean = false;

  serverDown = false;

  isAuthenticated(): Observable<boolean> {
    if (this.isLoggedIn) return of(true);
    return this.httpClient.get<any>(`${environment.backendURL}/auth`, { withCredentials: true }).pipe(
      catchError(() => {
        return of(this.serverDown = true);
      }),
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

  register(user: any): Observable<any> {
    return this.httpClient.post(`${environment.backendURL}/register`,
      {
        email: user.email,
        password: user.password,
      },
      { withCredentials: true, });
  }

  login(user: User): Observable<any> {
    return this.httpClient.post(`${environment.backendURL}/login`,
      {
        email: user.email,
        password: user.password,
      },
      { withCredentials: true, });
  }

  logout(): Observable<any> {
    return this.httpClient.get(`${environment.backendURL}/logout`,
      {
        withCredentials: true,
      }).pipe(
        map(res => {
          this.isLoggedIn = false;
          this.webID = -1;
          return res;
        }));
  }
}
