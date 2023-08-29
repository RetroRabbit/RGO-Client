import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartComponent implements OnInit {
  selectedDataType: string = '';
  selectedChartType: ChartType = 'bar';
  displayChart: boolean = false;

  chartData: any[] = [];
  chartLabels: string[] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  chartTypes: ChartType[] = ['bar', 'line', 'pie']; // Add more chart types as needed

  constructor(private ChartService: ChartService) {}

  ngOnInit(): void {}

  createAndDisplayChart(): void {
    if (this.selectedDataType) {
      this.ChartService.getAllCharts().subscribe(
        (data: any) => {
          this.chartData = [{ data: data.data, label: data.label }];
          this.chartLabels = data.labels;
          this.displayChart = true;
          console.log(this.chartData)
          this.updateChartType(this.selectedChartType); // Call to update chart type
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    }
  }

  updateChartType(chartType: ChartType): void {
    this.selectedChartType = chartType;
  }
}

