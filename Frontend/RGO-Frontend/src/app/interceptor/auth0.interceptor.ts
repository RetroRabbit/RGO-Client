import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Token } from '../models/token.interface';
import { AuthService } from '@auth0/auth0-angular';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string = '';

  constructor(private appStore: Store<{ app: Token }>, private auth: AuthService) {
    this.getToken();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authReq = req.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
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

