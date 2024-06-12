import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Token } from '../../../models/hris/token.interface';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/shared-services/auth-access/auth.service';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string = '';

  constructor(private appStore: Store<{ app: Token }>,
    private authService: AuthService,
     private cookieService: CookieService,
     private toast: NgToastService) {
    this.getToken();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return from(this.authService.RenewIfAccessTokenExpired(this.cookieService.get('accessToken'))).pipe(
      mergeMap((token: string) => {
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
                this.toast.error({ detail: "Error", summary: "Unauthorized action attempted", duration: 5000, position: 'topRight' });
              }
            },
          })
        );
      })
    );
  }

  getToken() {
    this.appStore.select('app').subscribe(state => {
      this.token = state.token;
    });
  }
}

