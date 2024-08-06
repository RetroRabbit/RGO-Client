import { Injectable } from '@angular/core';
import * as Auth0 from '@auth0/auth0-angular';
import { Observable, take, EMPTY, catchError, map, firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string;
  photo: string | undefined;

  constructor(
    private auth0: Auth0.AuthService,
    private client: HttpClient) {
    this.baseUrl = `${environment.HttpsBaseURL}/auth`
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth0.isAuthenticated$.pipe(take(1));
  }

  async getAccessToken(): Promise<string> {
    await firstValueFrom(this.isAuthenticated().pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          throw new Error('User not authenticated');
        }
      })
    ));

    try {
      const accessToken = await firstValueFrom(this.auth0.getAccessTokenSilently().pipe(take(1)));
      if (accessToken) {
        this.photo = this.decodeJwt(accessToken).photo || undefined;
        return accessToken;
      } else {
        throw new Error('Failed to retrieve access token (data is null or undefined).');
      }
    } catch (error) {
      throw new Error(`Error retrieving access token: ${error}`);
    }
  }

  async RenewIfAccessTokenExpired(token: string): Promise<string> {
    const decodedToken = this.decodeJwt(token);
    const expirationTime = decodedToken?.exp * 1000;

    if (Date.now() >= expirationTime) {
      return await this.getAccessToken();
    }
    return token;
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
  
  logout() {
    this.auth0.logout({
      logoutParams: { returnTo: document.location.origin },
    });
  }
  
  checkConnection(): Observable<string> {
    let header: HttpHeaders = new HttpHeaders();
    return this.client
      .get(
        `${this.baseUrl}`,
        { headers: header, responseType: 'text' }
      )
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

  checkUserExistenceInDatabase(): Observable<string> {
    let header: HttpHeaders = new HttpHeaders();
    return this.client
      .post(
        `${this.baseUrl}`,
        "",
        { headers: header, responseType: 'text' }
      )
      .pipe(
        map(type => type),
        catchError(err => {
          if (err.status === 404 || err.status === 0) {
            window.alert("Contact Admin about your account.");
          }
          return EMPTY;
        })
      );
  }  

}