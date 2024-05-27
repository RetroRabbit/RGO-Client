import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionCertificatesComponent } from './accordion-certificates.component';

describe('AccordionCertificatesComponent', () => {
  let component: AccordionCertificatesComponent;
  let fixture: ComponentFixture<AccordionCertificatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionCertificatesComponent]
    });
    fixture = TestBed.createComponent(AccordionCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
