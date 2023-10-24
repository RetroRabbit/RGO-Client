import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEvaluationsComponent } from './employee-evaluations.component';

describe('EmployeeEvaluationsComponent', () => {
  let component: EmployeeEvaluationsComponent;
  let fixture: ComponentFixture<EmployeeEvaluationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeEvaluationsComponent]
    });
    fixture = TestBed.createComponent(EmployeeEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
