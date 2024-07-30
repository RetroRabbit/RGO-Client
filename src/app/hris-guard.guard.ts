import { Injectable } from '@angular/core';
import { NavService } from './services/shared-services/nav-service/nav.service';
import { AuthService } from './services/shared-services/auth-access/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';

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
    if (this.navService.isHris === true) {
      return true;
    }

    if (this.navService.isHris == undefined) {
        this.navService.isHris = Boolean(this.cookieService.get('isHris'));
        return true;
    }
    this.authService.logout()
  }
}