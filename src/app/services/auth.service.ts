import { Injectable } from '@angular/core';
import * as Auth0 from '@auth0/auth0-angular';
import { Observable, firstValueFrom, take, EMPTY, catchError, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
<<<<<<< HEAD
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { Token } from '../models/token.interface';
import { tap } from 'rxjs/operators';
=======
import { environment } from '../../enviroment/environment';
import { Store } from '@ngrx/store';
import { Token } from '../models/token.interface';
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c

@Injectable({
  providedIn: 'root'
})
<<<<<<< HEAD
export class AuthServices {
=======
export class AuthService {
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c
  baseUrl: string;

  constructor(
    private auth: Auth0.AuthService,
    private client: HttpClient,
    private store: Store<{ app: Token }>) 
    { 
      this.baseUrl =`${environment.HttpsBaseURL}/auth`
    }

  isAuthenticated(): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(take(1))
  }

<<<<<<< HEAD

  getConfig() {


    const config$ = this.client.get(`${this.baseUrl}/config`)
    .pipe(tap((config: any) => {
      environment.DomainKey = config.domainKey;
      environment.ClientId = config.clientId;
      console.log(environment);
      console.log(config);
    return config;
  }))
    return EMPTY
}

=======
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c
  login(employeeEmail: string | undefined): Observable<string> {
    let header: HttpHeaders = new HttpHeaders();
    return this.client
      .post(
        `${this.baseUrl}/login?email=${encodeURIComponent(employeeEmail ?? "")}`,
        "",
        { headers: header, responseType: 'text' })
      .pipe(
        map(type => type),
        catchError(err => {
          if (err.status == 404) {
            window.alert("Contact admin to create your account")
          }
          return EMPTY
        })
      );
  }

  FetchRoles(employeeEmail: string | undefined): Observable<string> {
    let header: HttpHeaders = new HttpHeaders()
    header.append('Content-Type', 'application/json')
    return this.client
      .get(
        `${this.baseUrl}/roles?email=${encodeURIComponent(employeeEmail ?? "")}`,
        { headers: header, responseType: 'text' })
      .pipe(
        map(type => type),
        catchError(err => {
          if (err.status == 404) {
            window.alert("Contact admin to create your account")
          }
          return EMPTY
        })
      );
  }

  async getToken() {
    return await firstValueFrom(this.store.select('app'))
  }
}
