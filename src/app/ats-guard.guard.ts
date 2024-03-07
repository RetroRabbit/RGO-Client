import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { NavService } from './services/shared-services/nav-service/nav.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AtsPageGuard {
  constructor(private router: Router, private navService: NavService) {}
  
    canActivate: CanActivateFn = () => {
      if (!this.navService.isHris) {
        return true;
      }
      
      this.router.navigateByUrl('/ats-dashboard');
      return false;
    };
}
