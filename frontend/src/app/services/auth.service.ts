import { Injectable } from '@angular/core';
import { Observable, delay, map, of, tap } from 'rxjs';
import { User } from './user.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
    console.log("AuthService up");
   }

  user: User = {
    email: "test@test.hu",
    password: "hashedpw"
  }

  isLoggedIn: boolean = false;

  isAuthenticated(): Observable<boolean> {
    if (this.isLoggedIn) return of(true);
    return this.httpClient.get(`${environment.backendURL}/auth`, { observe: 'response' }).pipe(
      map(res => this.isLoggedIn = res.headers.get('authenticated') === 'true')
    );
  }

  register(user: any) {
    return this.httpClient.post(`${environment.backendURL}/register`, {
      email: user.email,
      password: user.password,
      passwordconfirm: user.passwordConfirm,
    })
  }

  login(user: User): Observable<any> {
    console.log(user);
    
    return this.httpClient.post(`${environment.backendURL}/login`, {
      email: user.email,
      password: user.password
    })
  }

  logout(): Observable<boolean> {
    return of(true).pipe(map(x => {
      console.log("Logged out!");
      
      this.isLoggedIn = false;
      return x;
    }))
  }
  
}
