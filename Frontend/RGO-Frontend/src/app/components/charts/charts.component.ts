import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartComponent implements OnInit {
  selectedChartType: ChartType = 'pie';
  displayChart: boolean = false;
  numberOfEmployees: number = 0;
  chartData: any[] = [];
  activeChart: any = null;
  showReport: boolean = false;

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    this.createAndDisplayChart();
    this.getNumberOfEmployees();
  }

  createAndDisplayChart(): void {
    this.chartService.getAllCharts().subscribe(
      (data: any[]) => {
        this.processChartData(data);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getNumberOfEmployees(): void {
    this.chartService.getTotalEmployees().subscribe(
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
      this.chartData = data;
      this.displayChart = true;
      this.selectedChartType = this.chartData[0].type;
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
    this.showReport = false; 
  }

  generateReport(): void {
    if (this.activeChart) {
      this.showReport = true; 
    }
  }
}

