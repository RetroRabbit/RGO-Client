import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { NavService } from './services/shared-services/nav-service/nav.service';
import { AuthService } from './services/shared-services/auth-access/auth.service';
import { AuthGuard } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})

export class HrisPageGuard {
  constructor(private navService: NavService,
    private authService: AuthService,
    private hrisGuard: AuthGuard,
  ) { }

  canActivate(_route: ActivatedRouteSnapshot, _state:
    RouterStateSnapshot): any {
    if (this.navService.isHris) {
      return true;
    }
    if (this.navService.isHris == undefined && environment.development) {
      this.navService.isHris = environment.development
      return this.hrisGuard.canActivate(_route, _state);
    }
    else if (this.navService.isHris == undefined) {
      this.authService.logout()
    }
    return false;
  }
}