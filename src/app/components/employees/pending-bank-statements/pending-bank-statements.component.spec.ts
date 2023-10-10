import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBankStatementsComponent } from './pending-bank-statements.component';

describe('PendingBankStatementsComponent', () => {
  let component: PendingBankStatementsComponent;
  let fixture: ComponentFixture<PendingBankStatementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingBankStatementsComponent]
    });
    fixture = TestBed.createComponent(PendingBankStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
