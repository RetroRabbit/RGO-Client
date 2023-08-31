import { Component } from '@angular/core';

@Component({
  selector: 'app-create-charts',
  templateUrl: './create-charts.component.html',
  styleUrls: ['./create-charts.component.css']
})
export class CreateChartsComponent {

  chartType: any= 'bar';
  chartData: number[] = [10, 20, 30, 40, 50];
  chartLabels: string[] = ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'];
  chartOptions: any = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };
chartName: string='';
  createChart() {
    // Logic to create and update the chart goes here.
  }
}
