import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { ChartType, ChartOptions } from 'chart.js';
import { ReportComponent } from '../chart-reports/chart-reports.component';

@Component({
  selector: 'app-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartComponent implements OnInit {
  selectedDataType: string = '';
  selectedChartType: ChartType = 'pie';
  displayChart: boolean = false;
  numberOfEmployees: number = 0;
  chartData: any[] = [];
  chartLabels: string[] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };
  chartTypes: ChartType[] = ['bar', 'line', 'pie'];
  activeChart: any = null; // To store the active chart

  constructor(private ChartService: ChartService) {}

  ngOnInit(): void {
    this.createAndDisplayChart();
    this.getNumberOfEmployees();
  }

  createAndDisplayChart(): void {
    this.ChartService.getAllCharts().subscribe(
      (data: any[]) => {
        this.processChartData(data);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getNumberOfEmployees(): void {
    this.ChartService.getTotalEmployees().subscribe(
      (data: any) => {
        this.numberOfEmployees = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  processChartData(data: any[]): void {
    if (data.length > 0) {
      this.chartData = data.map((item) => ({
        data: item.data,
        label: item.name,
        type: item.type,
        labels: item.labels,
      }));
      this.displayChart = true;
      this.selectedChartType = this.chartData[0].type;
      this.updateChartType(this.selectedChartType);
    } else {
      this.chartData = [];
      this.displayChart = false;
    }
  }

  updateChartType(chartType: ChartType): void {
    this.selectedChartType = chartType;
  }

  onChartClick(chart: any): void {
    this.activeChart = chart;
  }

  clearActiveChart(): void {
    this.activeChart = null;
  }
// Add a property to track whether to show the report component
showReport: boolean = false;

// Modify the generateReport() function to set showReport to true
generateReport(): void {
  if (this.activeChart) {
    // Set showReport to true to display the report component
    this.showReport = true;
  }
}

}


