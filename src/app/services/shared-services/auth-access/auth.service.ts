import { Injectable } from '@angular/core';
import * as Auth0 from '@auth0/auth0-angular';
import { Observable, firstValueFrom, take, EMPTY, catchError, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { Token } from '../../../models/hris/token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string;

  constructor(
    private auth: Auth0.AuthService,
    private client: HttpClient,
    private store: Store<{ app: Token }>) {
    this.baseUrl = `${environment.HttpsBaseURL}/auth`
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(take(1))
  }

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

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin },
    });
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
}