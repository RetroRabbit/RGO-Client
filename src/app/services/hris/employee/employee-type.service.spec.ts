import { TestBed } from '@angular/core/testing';

import { EmployeeTypeService } from './employee-type.service';

describe('EmployeeTypeService', () => {
  let service: EmployeeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
