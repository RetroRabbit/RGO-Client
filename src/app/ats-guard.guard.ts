import { CanActivateFn} from '@angular/router';
import { NavService } from './services/shared-services/nav-service/nav.service';
import { Injectable } from '@angular/core';
import { AuthService } from './services/shared-services/auth-access/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AtsPageGuard {
  constructor(private navService: NavService,
    private authService: AuthService) {}

    canActivate: CanActivateFn = () => { 

      if (this.navService.isHris == false) {
        return true;
      }
      
      if(this.navService.isHris == undefined){
        this.authService.logout()
     }
      return false;
    };
}
