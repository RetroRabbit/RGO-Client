import { Component, Input, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { HideNavService } from 'src/app/services/hide-nav.service';
@Component({
  selector: 'app-chart-report-pdf',
  templateUrl: './chart-report-pdf.component.html',
  styleUrls: ['./chart-report-pdf.component.css']
})
export class ChartReportPdfComponent {
  @Input() inputchartData !: { selectedChart: any; canvasData: any; };
  activeChart: any = null;
  showReport: boolean = false;
  public pieChartPlugins = [ChartDataLabels];
  public barChartPlugins = [ChartDataLabels];
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild('reportContent') reportContent!: ElementRef;
  @ViewChild('canvas') canvas: ElementRef = {} as ElementRef;

  ngOnInit() {
  }
  constructor(@Inject(MAT_DIALOG_DATA) public chartData: any, private chartService: ChartService, 
  private snackBarService: SnackbarService,
  private navService: HideNavService) {
    navService.showNavbar = true;
   }

  ngAfterViewInit() {
    if (this.canvas && this.canvas.nativeElement) {
      const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    }
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'middle',
        align: 'middle',
      } as any,
    },
  };


  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  generateReport(): void {
    const reportHTML = this.generateHTMLReport();
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(reportHTML);
      newWindow.document.close();
    }
  }
  generateHTMLReport(): string {
    const chartHTML = `<h1>${this.chartData.selectedChart.label}</h1>`;
    const dataHTML = `<p>Data: ${JSON.stringify(this.chartData.selectedChart.data)}</p>`;
    return `<html><body>${chartHTML}${dataHTML}</body></html>`;
  }

  getTotalEmployees(): number {
    return this.chartData.selectedChart.data.reduce((total: number, value: number) => total + value, 0);
  }

  calculatePercentage(value: number): string {
    const total: number = this.getTotalEmployees();
    const percentage: number = (value / total) * 100;
    return percentage.toFixed(2);
  }

  downloadReportAsPDF() {
    const container = document.querySelector(".container") as HTMLElement;
    if (container) {
      const originalStyle = container.getAttribute("style");
      container.style.height = 'fit-content';
      html2canvas(container).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('report.pdf');
        if (originalStyle !== null) {
          container.setAttribute("style", originalStyle);
        } else {
          container.removeAttribute("style");
        }
      }).catch(error => {
        this.snackBarService.showSnackbar("Error generating PDF", "snack-error");

        if (originalStyle !== null) {
          container.setAttribute("style", originalStyle);
        } else {
          container.removeAttribute("style");
        }
      });
    } else {
      this.snackBarService.showSnackbar("Could not find the container element to generate the PDF","snack-error");
    }
  }

  downloadReportAsCSV(dataTypes: string[]) {
    this.chartService.downloadCSV(dataTypes).subscribe(data => {
      const blob = new Blob([data], { type: 'text/csv' });
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = `${this.chartData.selectedChart.name}_chart.csv`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }
}
