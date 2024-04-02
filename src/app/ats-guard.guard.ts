import { NavService } from './services/shared-services/nav-service/nav.service';
import { Injectable } from '@angular/core';
import { AuthService } from './services/shared-services/auth-access/auth.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthAccessService } from './services/shared-services/auth-access/auth-access.service';
@Injectable({
  providedIn: 'root'
})

export class AtsPageGuard {
  constructor(private navService: NavService,
    private authService: AuthService,
    private cookieService: CookieService,
    private authAccessService: AuthAccessService,
  ) { }

  canActivate(): any {
    if (this.navService.isHris == false) {
      return true;
    }

    if (this.navService.isHris == undefined) {
      if (environment.development) {
        this.navService.isHris = Boolean(JSON.parse(this.cookieService.get('isHris')));
        this.authService.FetchRoles(this.cookieService.get('userEmail')).subscribe({
          next: roles => {
            this.authAccessService.setRoles(roles);
          }
        });
        return true;
      }
      this.authService.logout()
    }
  }
}
