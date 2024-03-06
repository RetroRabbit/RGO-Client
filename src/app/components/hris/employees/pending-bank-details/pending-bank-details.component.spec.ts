import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBankDetailsComponent } from './pending-bank-details.component';

describe('PendingBankStatementsComponent', () => {
  let component: PendingBankDetailsComponent;
  let fixture: ComponentFixture<PendingBankDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingBankDetailsComponent]
    });
    fixture = TestBed.createComponent(PendingBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
