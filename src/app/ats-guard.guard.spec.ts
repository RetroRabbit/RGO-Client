import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { AtsPageGuard } from './ats-guard.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

class MockAuthAccessService {
  hasAccessToAts(): boolean {
    return true;
  }
}

class MockRouter {
  navigate(commands: any[]): void {

  }
}

const mockRouteSnapshot: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
const mockRouterStateSnapshot: RouterStateSnapshot = {} as RouterStateSnapshot;

describe('AtsPageGuard', () => {
  let authAccessService: AuthAccessService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthAccessService, useClass: MockAuthAccessService },
        { provide: Router, useClass: MockRouter }
      ]
    });

    authAccessService = TestBed.inject(AuthAccessService);
    router = TestBed.inject(Router);
  });

  it('should allow access if user has access to ATS', () => {

    spyOn(authAccessService, 'hasAccessToAts').and.returnValue(true);

    const result = AtsPageGuard(mockRouteSnapshot, mockRouterStateSnapshot);

    expect(result).toBeTrue();
  });
});
