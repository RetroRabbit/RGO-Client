import { Injectable } from '@angular/core';
import * as Auth0 from '@auth0/auth0-angular';
import { Observable, firstValueFrom, take, EMPTY, catchError, map  } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API } from '../models/constants/urls.constants';
import { Store } from '@ngrx/store';
import { Token } from '../models/token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth0.AuthService,
    private client: HttpClient,
    private store: Store<{app : Token}>) { }

  isAuthenticated(): Observable<boolean>{
    return this.auth.isAuthenticated$.pipe(take(1))
  }

  login(userEmail: string|undefined): Observable<string>{
    let header: HttpHeaders = new HttpHeaders() 
    header.append('Content-Type','application/json')
    return this.client
    .post(
      `${API.HttpsBaseURL}/Authentication/login?email=${encodeURIComponent(userEmail??"")}`,
      "",
      {headers: header, responseType: 'text'})
    .pipe(
      map(type => type),
      catchError(err => {
        console.log(err)
        if (err.status == 404) {
          window.alert("Contact admin to create your account")
        }
        return EMPTY
      })
    );
  }

  FetchRoles(userEmail: string | undefined): Observable<string>{
    let header: HttpHeaders = new HttpHeaders() 
    header.append('Content-Type','application/json')
    return this.client
    .get(
      `${API.HttpsBaseURL}/Authentication/roles?email=${encodeURIComponent(userEmail??"")}`,
      {headers: header, responseType: 'text'})
    .pipe(
      map(type => type),
      catchError(err => {
        console.log(err)
        if (err.status == 404) {
          window.alert("Failed to get roles")
        }
        return EMPTY
      })
    );
  }

  async getToken(){
    return await firstValueFrom(this.store.select('app'))
  }
}
