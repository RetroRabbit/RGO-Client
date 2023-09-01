import { Component } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { ChartType, ChartOptions } from 'chart.js';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-charts',
  templateUrl: './create-charts.component.html',
  styleUrls: ['./create-charts.component.css']
})
export class CreateChartsComponent {

  chartName: string='Name';
  chartDataItem: string='Gender';
  chartType: any= 'bar';
  chartData: number[] = [];
  chartLabels: string[] = [];
  chartOptions: any = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  constructor(private ChartService: ChartService,private toast: NgToastService, private router: Router) {}

  ngOnInit() :void{
    this.getChartData();
  }

  createChart() {
    this.ChartService.createChart(this.chartDataItem, this.chartName, this.chartType)
      .subscribe(
        (response) => {
          this.toast.success({detail:"Success",summary:'Chart created',duration:5000, position:'topRight'});
          this.router.navigateByUrl('/charts');
        },
        (error) => {
            this.toast.error({detail:"Error", summary:"Failed to create chart.",duration:5000, position:'topRight'});
        }
      );
  }

  getChartData() {
    this.ChartService.getChartDataByType(this.chartDataItem).subscribe(
      (data:any) =>{
        this.chartData =data.data;
        this.chartLabels=data.labels;
       },
       (error) => {
        this.toast.error({detail:"Error", summary:"Failed to get chartData.",duration:5000, position:'topRight'});
       }
     );
  }

  onDropDownChange() {
    this.ChartService.getChartDataByType(this.chartDataItem).subscribe(
      (data:any) =>{
        this.chartData =data.data;
        this.chartLabels=data.labels;
       },
       (error) => {
        this.toast.error({detail:"Error", summary:"Failed to get chartData.",duration:5000, position:'topRight'});
       }
     );
  }
}
