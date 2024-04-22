import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBankingApprovalComponent } from './view-banking-approval.component';

describe('ViewBankingApprovalComponent', () => {
  let component: ViewBankingApprovalComponent;
  let fixture: ComponentFixture<ViewBankingApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBankingApprovalComponent]
    });
    fixture = TestBed.createComponent(ViewBankingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
