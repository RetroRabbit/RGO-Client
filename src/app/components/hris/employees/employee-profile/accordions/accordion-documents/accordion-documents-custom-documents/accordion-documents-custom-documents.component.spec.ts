import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionDocumentsCustomDocumentsComponent } from './accordion-documents-custom-documents.component';

describe('AccordionDocumentsCustomDocumentsComponent', () => {
  let component: AccordionDocumentsCustomDocumentsComponent;
  let fixture: ComponentFixture<AccordionDocumentsCustomDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionDocumentsCustomDocumentsComponent]
    });
    fixture = TestBed.createComponent(AccordionDocumentsCustomDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
