import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionProfileAddressDetailsComponent } from './accordion-profile-address-details.component';

describe('AccordionProfileAddressDetailsComponent', () => {
  let component: AccordionProfileAddressDetailsComponent;
  let fixture: ComponentFixture<AccordionProfileAddressDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionProfileAddressDetailsComponent]
    });
    fixture = TestBed.createComponent(AccordionProfileAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
