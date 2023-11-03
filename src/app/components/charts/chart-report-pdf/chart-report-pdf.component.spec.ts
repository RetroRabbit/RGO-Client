import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartReportPdfComponent } from './chart-report-pdf.component';

describe('ChartReportPdfComponent', () => {
  let component: ChartReportPdfComponent;
  let fixture: ComponentFixture<ChartReportPdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartReportPdfComponent]
    });
    fixture = TestBed.createComponent(ChartReportPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
