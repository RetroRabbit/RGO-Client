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
  selectedChartType: ChartType = 'pie';
  displayChart: boolean = false;

  chartData: any[] = [];
  chartLabels: string[] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  chartTypes: ChartType[] = ['bar', 'line', 'pie']; 

  constructor(private ChartService: ChartService) {}

  ngOnInit(): void {

   this.createAndDisplayChart();

  }

  createAndDisplayChart(): void {
    this.ChartService.getAllCharts().subscribe(
      (data: any[]) => {
        console.log('Fetched data:', data);
        this.processChartData(data);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  processChartData(data: any[]): void {
    if (data.length > 0) {
      this.chartData = data.map(item => ({
        data: item.data,
        label: item.name,
  
      }));
      this.chartLabels = data[0].labels;
      this.displayChart = true;
      this.selectedChartType= data[0].type;
      this.updateChartType(this.selectedChartType);
    } else {
      this.chartData = [];
      this.chartLabels = [];
      this.displayChart = false;
    }
  }

  updateChartType(chartType: ChartType): void {
    this.selectedChartType = chartType;
  }
}


