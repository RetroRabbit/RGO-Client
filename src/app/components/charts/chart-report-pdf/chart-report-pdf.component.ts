import { Component, Input, Inject } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'


@Component({
  selector: 'app-chart-report-pdf',
  templateUrl: './chart-report-pdf.component.html',
  styleUrls: ['./chart-report-pdf.component.css']
})
export class ChartReportPdfComponent {
  @Input() inputchartData !: { selectedChart: any; canvasData: any; };
  activeChart: any = null;
  showReport: boolean = false;
  clearActiveChart: () => void = () => { };
  public pieChartPlugins = [ChartDataLabels];
  public barChartPlugins = [ChartDataLabels];

  ngOnInit(){
  }
  constructor(@Inject(MAT_DIALOG_DATA) public chartData: any, private chartService: ChartService) {
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
    html2canvas(container).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('report.pdf');
    });
}
downloadReportAsCSV(dataTypes: string[]) {

  this.chartService.downloadCSV(dataTypes).subscribe(data => {
    const blob = new Blob([data], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'Report.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
}
}
