import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
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
}
