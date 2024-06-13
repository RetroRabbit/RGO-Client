import { Injectable } from '@angular/core';
import * as Auth0 from '@auth0/auth0-angular';
import { Observable, take, EMPTY, catchError, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string;

  constructor(
    private auth0: Auth0.AuthService,
    private client: HttpClient) {
    this.baseUrl = `${environment.HttpsBaseURL}/auth`
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth0.isAuthenticated$.pipe(take(1))
  }

  checkConnection(): Observable<string> {
    let header: HttpHeaders = new HttpHeaders();
    return this.client
      .post(
        `${this.baseUrl}`,
        "",
        { headers: header, responseType: 'text' })
      .pipe(
        map(type => type),
        catchError(err => {
          if (err.status === 404 || err.status === 0) {
            window.alert("No connection to server.");
          }
          return EMPTY;
        })
      );
  }

  logout() {
    this.auth0.logout({
      logoutParams: { returnTo: document.location.origin },
    });
  }

  base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    let pad = base64.length % 4;
    if (pad) {
      base64 += new Array(5 - pad).join('=');
    }
    return decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
  
  decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(this.base64UrlDecode(payload));
    } catch (e) {
      return null;
    }
  }
  
}