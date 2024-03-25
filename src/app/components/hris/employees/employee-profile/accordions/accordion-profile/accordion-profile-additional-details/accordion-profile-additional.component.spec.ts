import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionProfileAdditionalComponent } from './accordion-profile-additional.component';

describe('AccordionProfileAdditionalComponent', () => {
  let component: AccordionProfileAdditionalComponent;
  let fixture: ComponentFixture<AccordionProfileAdditionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionProfileAdditionalComponent]
    });
    fixture = TestBed.createComponent(AccordionProfileAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
