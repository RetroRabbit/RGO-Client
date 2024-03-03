import { TestBed } from '@angular/core/testing';

import { EmployeeAddressService } from './employee-address.service';

describe('EmployeeAddressService', () => {
  let service: EmployeeAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
