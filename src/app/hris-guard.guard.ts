import { Injectable } from '@angular/core';
import { NavService } from './services/shared-services/nav-service/nav.service';
import { AuthService } from './services/shared-services/auth-access/auth.service';
import { AuthGuard } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthAccessService } from './services/shared-services/auth-access/auth-access.service';
@Injectable({
  providedIn: 'root'
})

export class HrisPageGuard {
  constructor(private navService: NavService,
    private authService: AuthService,
    private cookieService: CookieService,
    private authAccessService: AuthAccessService
  ) { }

  canActivate(): any {
    if (this.navService.isHris) {
      return true;
    }

    if (this.navService.isHris == undefined) {
        this.navService.isHris = Boolean(this.cookieService.get('isHris'));
        this.authService.FetchRoles(this.cookieService.get('userEmail')).subscribe({
          next: roles => {
            this.authAccessService.setRoles(roles);
          }
        });
        return true;
    }
  }
}