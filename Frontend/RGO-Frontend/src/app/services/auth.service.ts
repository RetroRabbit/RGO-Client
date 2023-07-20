import { Injectable } from '@angular/core';

import * as Auth0 from '@auth0/auth0-angular';
import { Observable, firstValueFrom, take, EMPTY, catchError  } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth0.AuthService, private client: HttpClient) { }

  authenticateUser(): Observable<any>{

    this.generatePopUp();

    return this.auth.user$.pipe(take(1));
    
  }

  isAuthenticated(): Observable<boolean>{
    return this.auth.isAuthenticated$.pipe(take(1))
  }

  async generatePopUp(){
    await firstValueFrom(this.auth.loginWithPopup().pipe(take(1)));
      
  }

  login(userEmail: string|undefined): Observable<string>{
    let header: HttpHeaders = new HttpHeaders() 
    header.append('Content-Type','application/json')
    console.log(userEmail);
    let user ={
      email: userEmail,
    }
    return this.client.post(`${API.HttpsBaseURL}/Authentication/login`,user,{headers: header, responseType: 'text'})
    .pipe(
      catchError(err => {
        console.log(err)
        if (err.status == 404) {
          window.alert("Contact admin to create your account")
        }
        return EMPTY
      })
    );
  }
}
