import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import {  ChartType } from 'chart.js';
import { Chart } from 'src/app/models/charts.interface';
import { CookieService } from 'ngx-cookie-service';
import { ChartData } from '../../models/chartdata.interface';
import { colours } from '../../models/constants/colours.constants';
import { Table } from 'primeng/table';

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
  Type:'',}
  coloursArray : string[] = colours;
  chartCanvasArray: any[] = [];
    
  chartOptions = {
    events: [],
    scales: {
      x: {
          ticks: {
              autoSkip: false,
          }
      }

  }
}
    

  constructor(private chartService: ChartService,private cookieService: CookieService) {}

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
  }

  generateReport(): void {
    if (this.activeChart) {
      this.showReport = true;
    }
  }
  openUpdateForm(): void {
    if (this.activeChart) {
      this.updateFormData = { ...this.activeChart };
      this.showUpdateForm = true;
    }
  }

  updateChart(): void {
    if (this.activeChart) {
      
      const updatedChart: Chart = {
        ...this.activeChart,
        Name: this.updateFormData.Name,
        Type: this.updateFormData.Type,
      };
  
      this.chartService.updateChart(updatedChart).subscribe({
        next: (updatedData: any) => {
          const index = this.chartData.findIndex((c) => c.id === updatedData.Id);
          if (index !== -1) {
            this.chartData[index] = updatedData;
          }
  
          this.showUpdateForm = false;
          this.activeChart = null;
  
          this.createAndDisplayChart();
  
          if (this.selectedChartType !== updatedData.Type) {
            this.selectedChartType = updatedData.Type;
          }
        },
        error: error => { }
    });
    }
  }
  
  deleteChart(chartId: number): void {
    if (this.activeChart) {
      this.chartService.deleteChart(chartId).subscribe({
        next: () => {
          const index = this.chartData.findIndex((c) => c.id === chartId);
          if (index !== -1) {
            this.chartData.splice(index, 1);
          }
          this.clearActiveChart();
        },
        error: error => { }
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
      for(let j = 0; j < this.chartData[i].labels.length; j++){
        dataset.push({
          data: this.chartData[i].data[j],
          backgroundColor: this.coloursArray[j],
          borderColor: this.coloursArray[j],
          label: this.chartData[i].labels[j],
        });
      }
      this.chartCanvasArray.push(dataset);
      console.log(this.chartCanvasArray)
    }
  }
}

