import { Injectable } from '@angular/core';
import * as Auth0 from '@auth0/auth0-angular';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private auth0: Auth0.AuthService,
    private httpClient: HttpClient,
    public store: Store<Auth0.AppState>,
  ) { }

  login(): Observable<boolean> {
    return this.auth0
      .loginWithPopup()
      .pipe(
        switchMap(() => this.auth0.isAuthenticated$),
        take(1),
        tap((isAuthenticated) => {
          if (isAuthenticated) {
            console.log("Authenticated successful.");
            this.isAuthenticated$.next(true);
          } else {
            console.error("Authenticated failed.");
            this.isAuthenticated$.next(false);
          }
        })
      );
  }

  async getIdToken(): Promise<any> {
    await firstValueFrom(this.isAuthenticated$.pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          throw new Error('User not authenticated.');
        }
      })
    ));

    const idToken = await firstValueFrom(this.auth0.idTokenClaims$.pipe(take(1)));
    if (idToken) {
      console.log("json id token:", idToken);
      console.log("Extracted id token:", idToken.__raw);
      return idToken;
    } else {
      throw new Error('Failed to retrieve id token (data is null or undefined)');
    }
  }

  async getAccessToken(): Promise<string> {
    await firstValueFrom(this.isAuthenticated$.pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          throw new Error('User not authenticated');
        }
      })
    ));

    const accessToken = await firstValueFrom(this.auth0.getAccessTokenSilently().pipe(take(1)));
    if (accessToken) {
      console.log("Extracted access token:", accessToken);
      const decodedAccessToken = this.decodeJwt(accessToken);
      console.log("json access token:", decodedAccessToken);
      const permissions = decodedAccessToken.permissions || [];
      console.log("Permissions:", permissions);
      return accessToken;
    } else {
      throw new Error('Failed to retrieve access token (data is null or undefined).');
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
  
  async getUserInfo(): Promise<Auth0.User> {
    await firstValueFrom(this.isAuthenticated$.pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          throw new Error('User not authenticated.');
        }
      })
    ));

    const userInfo = await firstValueFrom(this.auth0.user$.pipe(take(1)));
    if (userInfo) {
      console.log("userinfo",userInfo);
      return userInfo;
    } else {
      throw new Error('Failed to retrieve user info (data is null or undefined).');
    }
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
      console.error('Invalid JWT Token', e);
      return null;
    }
  }

  logout() {
    this.auth0.logout({
      logoutParams: { returnTo: document.location.origin },
    });
  }

  async checkBackendConnection(): Promise<boolean> {
    const header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const isConnected = await firstValueFrom(
      this.httpClient.get(`${environment.HttpsBaseURL}/auth/`, { headers: header, responseType: 'json' }).pipe(
        map(() => true),
        catchError(() => of(false))
      )
    );
    return isConnected;
  }

}
