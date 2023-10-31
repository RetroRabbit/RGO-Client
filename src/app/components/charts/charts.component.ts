import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import {  ChartType } from 'chart.js';
import { Chart } from 'src/app/models/charts.interface';
import { CookieService } from 'ngx-cookie-service';
import { ChartData } from '../../models/chartdata.interface';
import { colours } from '../../models/constants/colours.constants';
import { Table } from 'primeng/table';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartComponent implements OnInit {
  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();
  
  selectedChartType: ChartType ='bar';
  displayChart: boolean = false;
  numberOfEmployees: number = 0;
  chartData: any[] = [];
  activeChart: any = null;
  showReport: boolean = false;
  showUpdateForm:boolean=false;
  updateFormData: any = {
      Name: '',
      Type:''
  }
  coloursArray : string[] = colours;
  chartCanvasArray: any[] = [];

  selectedChartIndex: number = -1;
  constructor(private chartService: ChartService,private cookieService: CookieService,
    private toast: NgToastService) {}

  ngOnInit(): void {
    this.createAndDisplayChart();
    this.getNumberOfEmployees();
  }

  createAndDisplayChart(): void {
    this.chartService.getAllCharts().subscribe({
      next: data => {
        this.processChartData(data);
      },
      error: error => { }
  });
  }



  getNumberOfEmployees(): void {
    this.chartService.getTotalEmployees().subscribe({
      next: data => {
        this.numberOfEmployees = data;
      },
      error: error => {  }
  });
  }

  processChartData(data: any[]): void {
    if (data.length > 0) {
      this.chartData = data;
      console.log(this.chartData);
      this.populateCanvasCharts();
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
    this.showUpdateForm = false;
  }

  generateReport(): void {
    if (this.activeChart) {
      this.showReport = true;
    }
  }
  // openUpdateForm(): void {
  //   if (this.activeChart) {
  //     this.updateFormData = { ...this.activeChart };
  //     this.showUpdateForm = true;
  //   }
  // }

  updateChart(): void {

    if (this.activeChart) {
      const updatedChart: Chart = {
        ...this.activeChart,
        Name: this.updateFormData.Name,
        Type: this.updateFormData.Type,
      };
    // console.log(this.updateFormData)
      this.chartService.updateChart(this.updateFormData).subscribe({
        next: (updatedData: any) => {
          this.toast.success({detail:"Success",summary: "Update successful",duration:5000, position:'topRight'});
          this.createAndDisplayChart();
          this.showUpdateForm = false;
          this.updateFormData = null;
          // const index = this.chartData.findIndex((c) => c.id === updatedData.Id);
          // if (index !== -1) {
          //   this.chartData[index] = updatedData;
          // }
  
          // this.showUpdateForm = false;
          // this.activeChart = null;
  
          // this.createAndDisplayChart();
  
          // if (this.selectedChartType !== updatedData.Type) {
          //   this.selectedChartType = updatedData.Type;
          // }
        },
        error: error => {
          this.toast.error({detail:"error",summary: "Update unsuccessful",duration:5000, position:'topRight'});

         }
    });
    }
  }
  
  editChart(index : number){
    this.selectedChartIndex = index;
    this.activeChart = this.chartData[index];
    this.updateFormData = {...this.activeChart};
    this.showUpdateForm = true;
  }

  deleteChart(selectedIndex : number): void {
    console.log(selectedIndex);
    if (this.chartData[selectedIndex]) {
      this.chartService.deleteChart(this.chartData[selectedIndex].id).subscribe({
        next: () => {
          this.toast.success({detail:"Success",summary: "Delete successful",duration:5000, position:'topRight'});
          this.createAndDisplayChart();
          //const index = this.chartData.findIndex((c) => c.id === chartId);
          // if (index !== -1) {
          //   this.chartData.splice(index, 1);
          // }
          // this.clearActiveChart();
        },
        error: error => {
          this.toast.error({detail:"Error",summary: "Failed to detele graph",duration:5000, position:'topRight'});
        }
    });
    }
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }

  
  populateCanvasCharts(){
    for(let i = 0; i < this.chartData.length; i++) {
      let dataset = [];
      let data : any;
      if(this.chartData[i].type == 'pie'){
        var labelsArray : any[] = [];
        this.chartData[i].labels.forEach( (label : any) => {
          labelsArray.push(label);
        });
         var obj = {
          data: this.chartData[i].data,
          backgroundColor: this.coloursArray,
          borderColor: this.coloursArray,
          labels: labelsArray
         }
        dataset.push(obj)
      }else{

        for(let j = 0; j < this.chartData[i].labels.length; j++){
          
          dataset.push({
            data: [this.chartData[i].data[j]],
            backgroundColor: this.coloursArray[j],
            borderColor: this.coloursArray[j],
            label: this.chartData[i].labels[j]
          });
          
        }
      }
      this.chartCanvasArray.push(dataset);
    }
  }
}

