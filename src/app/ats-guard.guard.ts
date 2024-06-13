import { NavService } from './services/shared-services/nav-service/nav.service';
import { Injectable } from '@angular/core';
import { AuthService } from './services/shared-services/auth-access/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class AtsPageGuard {
  constructor(private navService: NavService,
    private authService: AuthService,
    private cookieService: CookieService,
  ) { }

  canActivate(): any {
    if (this.navService.isHris === false) {
      return true;
    }

    if (this.navService.isHris == undefined) {
        this.navService.isHris = Boolean(JSON.parse(this.cookieService.get('isHris')));
        this.authAccessService.setRoles(this.cookieService.get('userType'));
        return true;
    }
    this.authService.logout()
  }
}
