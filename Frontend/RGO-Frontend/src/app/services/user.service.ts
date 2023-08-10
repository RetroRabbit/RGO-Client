import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<User[]>{
    return this.httpClient.get<User[]>(`${API.HttpBaseURL}/users/get`);
  }
}
