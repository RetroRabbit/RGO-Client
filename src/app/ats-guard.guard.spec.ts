import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { atsGuardGuard } from './ats-guard.guard';

describe('atsGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => atsGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
