import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './chart-reports.component.html',
  styleUrls: ['./chart-reports.component.css']
})
export class ReportComponent {
  @Input() chartData: any; // Input property to receive chart data

  
  generateReport(): void {
    // Generate an HTML report using the chart data
    const reportHTML = this.generateHTMLReport();

    // Open the report in a new window if newWindow is not null
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
    // Customize this function to generate HTML content for your report
    // You can format and structure the report as needed
    const chartHTML = `<h1>${this.chartData.label}</h1>`;
    const dataHTML = `<p>Data: ${JSON.stringify(this.chartData.data)}</p>`;

    // Combine chart and data information into the report
    return `<html><body>${chartHTML}${dataHTML}</body></html>`;
  }

  getTotalEmployees(): number {
    // Calculate the total number of employees
    return this.chartData.data.reduce((total: number, value: number) => total + value, 0);
  }

  calculatePercentage(value: number): string {
    // Calculate the percentage of employees for a label
    const total: number = this.getTotalEmployees();
    const percentage: number = (value / total) * 100;
    return percentage.toFixed(2); // Display percentage with two decimal places
  }
}
