import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionSalaryDetailsComponent } from './accordion-salary-details.component';

describe('AccordionSalaryDetailsComponent', () => {
  let component: AccordionSalaryDetailsComponent;
  let fixture: ComponentFixture<AccordionSalaryDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionSalaryDetailsComponent]
    });
    fixture = TestBed.createComponent(AccordionSalaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
