import { Component } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { ChartType, ChartOptions } from 'chart.js';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-create-charts',
  templateUrl: './create-charts.component.html',
  styleUrls: ['./create-charts.component.css']
})
export class CreateChartsComponent {

 
  chartName: string='';
  chartDataItem: string='Gender';
  chartType: any= 'bar';
  chartData: number[] = [10, 20, 30, 40, 50];
  chartLabels: string[] = ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'];
  chartOptions: any = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  constructor(private ChartService: ChartService,private toast: NgToastService) {}

  createChart() {
    this.ChartService.createChart(this.chartDataItem, this.chartName, this.chartType)
      .subscribe(
        (response) => {
          this.toast.success({detail:"Success",summary:'Chart created',duration:5000, position:'topRight'});
        },
        (error) => {
          
            this.toast.error({detail:"Error", summary:"Failed to create chart.",duration:5000, position:'topRight'});
        }
      );
  }
}
