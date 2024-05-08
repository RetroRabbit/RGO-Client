import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionDucumentsAdditionalComponent } from './accordion-documents-additional.component';

describe('AccordionDucumentsAdditionalComponent', () => {
  let component: AccordionDucumentsAdditionalComponent;
  let fixture: ComponentFixture<AccordionDucumentsAdditionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionDucumentsAdditionalComponent]
    });
    fixture = TestBed.createComponent(AccordionDucumentsAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
