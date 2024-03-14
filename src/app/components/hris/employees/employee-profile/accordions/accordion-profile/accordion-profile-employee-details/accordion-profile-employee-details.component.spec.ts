import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionProfileEmployeeDetailsComponent } from './accordion-profile-employee-details.component';

describe('AccordionProfileEmployeeDetailsComponent', () => {
  let component: AccordionProfileEmployeeDetailsComponent;
  let fixture: ComponentFixture<AccordionProfileEmployeeDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionProfileEmployeeDetailsComponent]
    });
    fixture = TestBed.createComponent(AccordionProfileEmployeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
