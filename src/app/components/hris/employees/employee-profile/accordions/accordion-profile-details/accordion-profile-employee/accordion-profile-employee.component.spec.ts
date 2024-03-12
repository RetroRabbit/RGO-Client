import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionProfileEmployeeComponent } from './accordion-profile-employee.component';

describe('AccordionProfileEmployeeComponent', () => {
  let component: AccordionProfileEmployeeComponent;
  let fixture: ComponentFixture<AccordionProfileEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionProfileEmployeeComponent]
    });
    fixture = TestBed.createComponent(AccordionProfileEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });




  describe('AccordionProfileEmployeeComponent', () => {
    let component: AccordionProfileEmployeeComponent;
    let fixture: ComponentFixture<AccordionProfileEmployeeComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AccordionProfileEmployeeComponent]
      });
      fixture = TestBed.createComponent(AccordionProfileEmployeeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
