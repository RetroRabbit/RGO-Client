import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionDocumentsComponent } from './accordion-documents.component';

describe('AccordionDocumentsComponent', () => {
  let component: AccordionDocumentsComponent;
  let fixture: ComponentFixture<AccordionDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionDocumentsComponent]
    });
    fixture = TestBed.createComponent(AccordionDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
