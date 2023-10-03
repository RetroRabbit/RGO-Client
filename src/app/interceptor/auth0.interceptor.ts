import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Token } from '../models/token.interface';
import { AuthService } from '@auth0/auth0-angular';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string = '';

  constructor(private appStore: Store<{ app: Token }>, private auth: AuthService, private cookieService: CookieService) {
    this.getToken();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.cookieService.get('userToken');
    const authReq = req.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });

    return next.handle(authReq).pipe(
      tap({
        error: (error: any) => {
          if (error.status === 403 || error.status === 401) {
            this.auth.logout({
              logoutParams: { returnTo: document.location.origin },
            });
          }
        },
      })
    );
  }

  getToken() {
    this.appStore.select('app').subscribe(state => {
      this.token = state.token;
    });
  }
}

