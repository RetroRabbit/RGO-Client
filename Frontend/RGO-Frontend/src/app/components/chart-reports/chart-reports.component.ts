import { Component, Input } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';

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
  
constructor(private chartService: ChartService) {}

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
