import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionProfileContactDetailsComponent } from './accordion-profile-contact-details.component';

describe('AccordionProfileContactDetailsComponent', () => {
  let component: AccordionProfileContactDetailsComponent;
  let fixture: ComponentFixture<AccordionProfileContactDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionProfileContactDetailsComponent]
    });
    fixture = TestBed.createComponent(AccordionProfileContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
