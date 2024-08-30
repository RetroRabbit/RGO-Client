import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { CanActivateFn } from '@angular/router';

export const HrisPageGuard: CanActivateFn = (route, state) => {
  const authAccessService = inject(AuthAccessService);
  const router = inject(Router);

  if (authAccessService.hasSignedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};