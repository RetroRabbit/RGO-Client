import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { HrisPageGuard } from './hris-guard.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Create mock services
class MockAuthAccessService {
  hasSignedIn(): boolean {
    return true; // or false depending on what you want to test
  }
}

class MockRouter {
  navigate(commands: any[]): void {
    // Define mock behavior here if needed
  }
}

// Dummy values for ActivatedRouteSnapshot and RouterStateSnapshot
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

    // Get instances of the services
    authAccessService = TestBed.inject(AuthAccessService);
    router = TestBed.inject(Router);
  });

  it('should allow access if user is signed in', () => {
    // Given
    spyOn(authAccessService, 'hasSignedIn').and.returnValue(true);

    // When
    const result = HrisPageGuard(mockRouteSnapshot, mockRouterStateSnapshot);

    // Then
    expect(result).toBeTrue();
  });

  it('should deny access if user is not signed in', () => {
    // Given
    spyOn(authAccessService, 'hasSignedIn').and.returnValue(false);

    // When
    const result = HrisPageGuard(mockRouteSnapshot, mockRouterStateSnapshot);

    // Then
    expect(result).toBeFalse();
  });
});
