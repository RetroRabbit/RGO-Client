import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsReportsComponent } from './ats-reports.component';

describe('AtsReportsComponent', () => {
  let component: AtsReportsComponent;
  let fixture: ComponentFixture<AtsReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtsReportsComponent]
    });
    fixture = TestBed.createComponent(AtsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
