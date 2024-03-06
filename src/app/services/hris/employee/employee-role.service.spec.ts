import { TestBed } from '@angular/core/testing';

import { EmployeeRoleService } from './employee-role.service';

describe('EmployeeRoleService', () => {
  let service: EmployeeRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
