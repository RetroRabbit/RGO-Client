import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { ChartType } from 'chart.js';
import { Chart } from 'src/app/models/charts.interface';

@Component({
  selector: 'app-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartComponent implements OnInit {
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
  openUpdateForm(): void {
    if (this.activeChart) {
      // Copy activeChart data to the updateFormData object
      this.updateFormData = { ...this.activeChart };
      this.showUpdateForm = true;
    }
  }

  // Function to submit the update form
 
  updateChart(): void {
    if (this.activeChart) {
      
      const updatedChart: Chart = {
        ...this.activeChart,
        Name: this.updateFormData.Name,
        Type: this.updateFormData.Type,
      };
  
      this.chartService.updateChart(updatedChart).subscribe(
        (updatedData: any) => {
          // Update the chart in the chartData array with the updated data
          const index = this.chartData.findIndex((c) => c.id === updatedData.Id);
          if (index !== -1) {
            this.chartData[index] = updatedData;
          }
  
          // Hide the update form and reset the activeChart
          this.showUpdateForm = false;
          this.activeChart = null;
  
          // Display a success message
          console.log('Chart updated successfully.');
  
          // Fetch the updated chart data and refresh the display
          this.createAndDisplayChart();
  
          // Update the selectedChartType if necessary
          if (this.selectedChartType !== updatedData.Type) {
            this.selectedChartType = updatedData.Type;
          }
        },
        (error) => {
          console.error('Error updating chart:', error);
  
          // Display an error message
          console.error('Failed to update the chart.');
        }
      );
    }
  }
  
  deleteChart(chartId: number): void {
    if (this.activeChart) {
      this.chartService.deleteChart(chartId).subscribe(
        () => {
          // Remove the chart from the chartData array
          const index = this.chartData.findIndex((c) => c.id === chartId);
          if (index !== -1) {
            this.chartData.splice(index, 1);
          }
          this.clearActiveChart();
          // Display a success message
          console.log('Chart deleted successfully.');
        },
        (error) => {
          console.error('Error deleting chart:', error);
          // Display an error message
          console.error('Failed to delete the chart.');
        }
      );
    }
  }
}

