import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getUsers(): Observable<User> {
    console.log("getusers");
    
    return this.httpClient.get<User>(`${environment.backendURL}/logout`);
  }
}
