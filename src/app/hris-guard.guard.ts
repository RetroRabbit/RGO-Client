import { CanActivateFn} from '@angular/router';
import { Injectable } from '@angular/core';
import { NavService } from './services/shared-services/nav-service/nav.service';
import { AuthService } from './services/shared-services/auth-access/auth.service';

@Injectable({
  providedIn: 'root'
})

export class HrisPageGuard {
  constructor( private navService: NavService,
    private authService: AuthService
    ) {}

  canActivate: CanActivateFn = () => {
    if (this.navService.isHris) {
      return true;
    }

    if(this.navService.isHris == undefined){
      this.authService.logout()
   }
    return false;
  };
}