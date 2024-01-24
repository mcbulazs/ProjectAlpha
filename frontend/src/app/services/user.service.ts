import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { User } from './user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  user: User = {
    email: "test@test.hu",
    password: "hashedpw"
  }

  getUsers(): Observable<User> {
    //return this.httpClient.get<User>(`${environment.backendURL}/users`);
    return of(this.user).pipe(delay(500));
  }
}
