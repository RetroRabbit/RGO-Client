import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { routeGuardGuard } from './hris-guard.guard';

describe('routeGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => routeGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
