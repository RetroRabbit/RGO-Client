import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionStarterDocumentsComponent } from './accordion-starter-documents.component';

describe('AccordionDocumentsComponent', () => {
  let component: AccordionStarterDocumentsComponent;
  let fixture: ComponentFixture<AccordionStarterDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionStarterDocumentsComponent]
    });
    fixture = TestBed.createComponent(AccordionStarterDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
