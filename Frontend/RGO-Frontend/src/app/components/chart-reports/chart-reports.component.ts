import { Component, Input } from '@angular/core';

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
} 
