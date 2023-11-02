import { Component, Input, Inject } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  ngOnInit(){
  }
  constructor(@Inject(MAT_DIALOG_DATA) public chartData: any, private chartService: ChartService) {
  }

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

        // Create a document in portrait layout (210mm x 297mm)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('report.pdf');
    });
}
}
