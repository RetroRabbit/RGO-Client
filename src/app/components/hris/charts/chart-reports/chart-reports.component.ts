import { Component, Input } from '@angular/core';
import { ChartService } from 'src/app/services/hris/charts.service';
import { ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { barChartOptions, pieChartOptions } from 'src/app/models/hris/constants/chartOptions.constants';
@Component({
  selector: 'app-report',
  templateUrl: './chart-reports.component.html',
  styleUrls: ['./chart-reports.component.css']
})

export class ReportComponent {
  @Input() chartData !: { selectedChart: any; canvasData: any; };
  activeChart: any = null;
  showReport: boolean = false;
  public pieChartPlugins = [ChartDataLabels];
  public barChartPlugins = [ChartDataLabels];

  constructor(private chartService: ChartService, navService: NavService) {
    navService.showNavbar = true;
  }

  barChartOptions = barChartOptions;
  pieChartOptions = pieChartOptions;

  isPieChart(chartType: string): boolean {
    return chartType === 'pie';
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
    let employeeTotal = 0;
    this.chartData.selectedChart.datasets.forEach((dataset: any) => {
      employeeTotal += dataset.data.reduce((a: number, b: number) => a + b, 0);
    });
    return employeeTotal;
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
