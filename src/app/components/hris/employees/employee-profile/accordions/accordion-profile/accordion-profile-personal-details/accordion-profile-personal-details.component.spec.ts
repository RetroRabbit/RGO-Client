import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionProfilePersonalDetailsComponent } from './accordion-profile-personal-details.component';

describe('AccordionProfilePersonalDetailsComponent', () => {
  let component: AccordionProfilePersonalDetailsComponent;
  let fixture: ComponentFixture<AccordionProfilePersonalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionProfilePersonalDetailsComponent]
    });
    fixture = TestBed.createComponent(AccordionProfilePersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
