import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeApprovalsComponent } from './employee-approvals.component';

describe('EmployeeApprovalsComponent', () => {
  let component: EmployeeApprovalsComponent;
  let fixture: ComponentFixture<EmployeeApprovalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeApprovalsComponent]
    });
    fixture = TestBed.createComponent(EmployeeApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
