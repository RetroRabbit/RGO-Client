import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRoleManagerComponent } from './employee-role-manager.component';

describe('EmployeeRoleManagerComponent', () => {
  let component: EmployeeRoleManagerComponent;
  let fixture: ComponentFixture<EmployeeRoleManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeRoleManagerComponent]
    });
    fixture = TestBed.createComponent(EmployeeRoleManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
