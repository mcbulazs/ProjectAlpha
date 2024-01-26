import { Injectable } from '@angular/core';
import { Observable, delay, map, of, tap } from 'rxjs';
import { User } from './user.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {}

  isLoggedIn: boolean = false;

  isAuthenticated(): Observable<boolean> {
    if (this.isLoggedIn) return of(true);
    return this.httpClient.get(`${environment.backendURL}/auth`, { observe: 'response', withCredentials: true }).pipe(
      map(res => this.isLoggedIn = res.headers.get('authenticated') === 'true')
    );
  }

  register(user: any) {
    return this.httpClient.post(`${environment.backendURL}/register`, {
      email: user.email.toLowerCase(),
      password: user.password,
    }, {
      withCredentials: true
    })
  }

  login(user: User): Observable<any> {
    return this.httpClient.post(`${environment.backendURL}/login`, {
      email: user.email.toLowerCase(),
      password: user.password,
    }, {
      withCredentials: true
    })
  }

  logout(): Observable<any> {
    return this.httpClient.get(`${environment.backendURL}/logout`, {
      withCredentials: true,
    }).pipe(map(res => {
      this.isLoggedIn = false;
      return res;
    }));
  }
  
}