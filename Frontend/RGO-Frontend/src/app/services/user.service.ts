import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<User>{
    return this.httpClient.get<User>(`${API.HttpBaseURL}/users/get`);
  }

  addUser(newUser: any): Observable<any>{
    return this.httpClient.post<any>(`${API.HttpBaseURL}/users/add`, newUser);
  }
}
