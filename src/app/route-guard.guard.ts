import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { NavService } from './services/shared-services/nav-service/nav.service';

@Injectable({
  providedIn: 'root'
})

export class HrisPageGuard {
  constructor(private router: Router, private navService: NavService) {}

  canActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) => {
    if (this.navService.isHris) {
      return true;
    }
    this.router.navigateByUrl('/ats-dashboard');
    return false;
  };
}




