import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionDocumentsAdditionalComponent } from './accordion-my-documents.component';

describe('AccordionDucumentsAdditionalComponent', () => {
  let component: AccordionDocumentsAdditionalComponent;
  let fixture: ComponentFixture<AccordionDocumentsAdditionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionDocumentsAdditionalComponent]
    });
    fixture = TestBed.createComponent(AccordionDocumentsAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
