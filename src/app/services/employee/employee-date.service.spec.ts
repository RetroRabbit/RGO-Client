import { TestBed } from '@angular/core/testing';

import { EmployeeDateService } from './employee-date.service';

describe('EmployeeDateService', () => {
  let service: EmployeeDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
