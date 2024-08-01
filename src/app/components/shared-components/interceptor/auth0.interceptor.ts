import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/shared-services/auth-access/auth.service';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AppState } from '../../shared-components/store/app.state';
import { selectToken } from '../../shared-components/store/selector/sign-in.selector';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string = '';
    constructor(private store: Store<AppState>,
    private authService: AuthService,
    private toast: NgToastService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.store.select(selectToken).subscribe((storeToken) => { this.token = storeToken?.token || ''; });
    return from(this.authService.RenewIfAccessTokenExpired(this.token)).pipe(
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
}
