import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ngxCsv } from 'ngx-csv';

@Component({
  selector: 'app-report',
  templateUrl: './chart-reports.component.html',
  styleUrls: ['./chart-reports.component.css']
})
export class ReportComponent {
  @Input() chartData: any; 
activeChart: any = null;
showReport: boolean = false; 
clearActiveChart: () => void = () => {};
  
generateReport(): void {
   const reportHTML = this.generateHTMLReport();
   const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(reportHTML);
      newWindow.document.close();
    } else {
      console.error('Failed to open a new window for the report.');
    }
  }
generateHTMLReport(): string {
    const chartHTML = `<h1>${this.chartData.label}</h1>`;
    const dataHTML = `<p>Data: ${JSON.stringify(this.chartData.data)}</p>`;
    return `<html><body>${chartHTML}${dataHTML}</body></html>`;
  }

getTotalEmployees(): number {
    return this.chartData.data.reduce((total: number, value: number) => total + value, 0);
  }

calculatePercentage(value: number): string {
    const total: number = this.getTotalEmployees();
    const percentage: number = (value / total) * 100;
    return percentage.toFixed(2); 
  }
  downloadPDF(): void {
    const chartReport = document.querySelector('.report-wrapper') as HTMLElement;
  
    if (chartReport) {
      // Use html2canvas to capture the chart report as an image
      html2canvas(chartReport).then(function(canvas) {
        const imgData = canvas.toDataURL('image/png');
  
        // Create a PDF document
        const pdf = new jsPDF(); // Use the jsPDF constructor
  
        // Set PDF size (optional)
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 size
  
        // Save the PDF with a specific name
        pdf.save('chart_report.pdf');
      });
    } else {
      console.error('Failed to find .report-wrapper element.');
    }
  }
  convertToCSV(): void {
    const dataToExport = [];
    dataToExport.push(['Label', 'Value']); // CSV header

    for (let i = 0; i < this.chartData.labels.length; i++) {
      dataToExport.push([this.chartData.labels[i], this.chartData.data[i]]);
    }

    // Convert the data to CSV format
    const csvData = dataToExport.map(row => row.join(',')).join('\n');

    // Trigger the export as a CSV file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'chart_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
} 
