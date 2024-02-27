import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsApplicantsComponent } from './ats-applicants.component';

describe('AtsApplicantsComponent', () => {
  let component: AtsApplicantsComponent;
  let fixture: ComponentFixture<AtsApplicantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtsApplicantsComponent]
    });
    fixture = TestBed.createComponent(AtsApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
