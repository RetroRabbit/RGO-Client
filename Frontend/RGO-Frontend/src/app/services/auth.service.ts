import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError } from 'rxjs';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private client: HttpClient) { }

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
