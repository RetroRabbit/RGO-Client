import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../models/user.interface';
import { environment } from 'src/enviroment/env';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly User_Url = environment.Abstract_Layer_URL + 'Users/'; // backend

  httpOptions = {
    headers: new HttpHeaders({
      contentType: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
    }),
  };

  constructor(private http: HttpClient) {}

  //User
  //Get with ID?
  getUser(id?: number): Observable<Users[]> {
    if (id) {
      return this.http.get<Users[]>(this.User_Url + 'GetUser/' + id);
    }
    return this.http.get<Users[]>(this.User_Url + 'GetUser');
  }

  //Get with ID?
  getUserByGoogleId(id: number): Observable<Users[]> {
    return this.http.get<Users[]>(this.User_Url + 'GetUserWithGoogleId/' + id);
  }

  //Add and Update User
  saveUser(user: Users): Observable<Users> {
    return this.http.post<Users>(
      this.User_Url + 'SaveUser',
      user,
      this.httpOptions
    );
  }

  //Soft Delete
  deleteSoftUser(id: number): Observable<Users> {
    const url = this.User_Url + 'DeleteUser';
    const softDeleteUser = {
      UserId: id,
      isDeleted: true,
    };
    return this.http.put<Users>(url, softDeleteUser);
  }
}
