import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionBankingComponent } from './accordion-banking.component';

describe('AccordionBankingComponent', () => {
  let component: AccordionBankingComponent;
  let fixture: ComponentFixture<AccordionBankingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionBankingComponent]
    });
    fixture = TestBed.createComponent(AccordionBankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
