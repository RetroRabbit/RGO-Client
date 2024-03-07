import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { NavService } from './services/shared-services/nav-service/nav.service';

export class AtsPageGuard {
  constructor(private router: Router, private navService: NavService) {}
  
    canActivate: CanActivateFn = (
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot) => {
      if (!this.navService.isHris) {
        return true;
      }
      this.router.navigateByUrl('/dashboard');
      return false;
    };
}
