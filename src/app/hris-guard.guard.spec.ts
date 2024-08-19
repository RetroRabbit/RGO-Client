import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { HrisPageGuard } from './hris-guard.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

class MockAuthAccessService {
  hasSignedIn(): boolean {
    return true; // or false depending on what you want to test
  }
}

class MockRouter {
  navigate(commands: any[]): void {

  }
}

const mockRouteSnapshot: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
const mockRouterStateSnapshot: RouterStateSnapshot = {} as RouterStateSnapshot;

describe('HrisPageGuard', () => {
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

  it('should allow access if user is signed in', () => {

    spyOn(authAccessService, 'hasSignedIn').and.returnValue(true);

    const result = HrisPageGuard(mockRouteSnapshot, mockRouterStateSnapshot);

    expect(result).toBeTrue();
  });

  it('should deny access if user is not signed in', () => {

    spyOn(authAccessService, 'hasSignedIn').and.returnValue(false);

    const result = HrisPageGuard(mockRouteSnapshot, mockRouterStateSnapshot);

    expect(result).toBeFalse();
  });
});
