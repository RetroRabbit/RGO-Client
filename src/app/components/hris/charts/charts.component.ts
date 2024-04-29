
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, HostListener } from '@angular/core';
import { ChartService } from 'src/app/services/hris/charts.service';
import { ChartData } from 'src/app/models/hris/charts.interface';
import { colours } from '../../../models/hris/constants/colours.constants';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ChartReportPdfComponent } from './chart-report-pdf/chart-report-pdf.component';
import { ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { EmployeeType } from 'src/app/models/hris/constants/employeeTypes.constants';
import { Chart } from 'chart.js';
import { pieChartOptions, barChartOptions } from 'src/app/models/hris/constants/chartOptions.constants';

@Component({
  selector: 'app-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})

export class ChartComponent implements OnInit {

  constructor(private chartService: ChartService, 
    public dialog: MatDialog, 
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    navService: NavService) {
    navService.showNavbar = true;
  }

  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();
  @Output() captureCharts = new EventEmitter<number>();
  @Input() chartsArray: ChartData[] = [];

  screenWidth: number = 767;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  selectedChartType: ChartType = 'bar';
  displayChart: boolean = false;
  numberOfEmployees: number = 0;
  chartData: any[] = [];
  activeChart: any = null;
  employeeNames: { [id: string]: string } = {};
  showReport: boolean = false;
  showUpdateForm: boolean = false;
  coloursArray: string[] = colours;
  chart: Chart | undefined;
  chartCanvasArray: any[] = [];
  pieChartPlugins = [ChartDataLabels];
  barChartPlugins = [ChartDataLabels];
  selectedChartIndex: number = -1;
  barChartOptions = barChartOptions;
  pieChartOptions = pieChartOptions;

  updateFormData: any = {
    Name: '',
    Type: '',
  }
  
  getChartOptions(chartType: string) {
    return chartType === 'bar' ? this.barChartOptions : this.pieChartOptions;
  }

  resetPage() {
    this.displayChart = false;
    this.chartData = [];
    this.activeChart = null;
    this.showReport = false;
    this.showUpdateForm = false;
    this.chartCanvasArray = [];
    this.updateFormData = {
      Name: '',
      Type: ''
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartsArray'] && !changes['chartsArray'].firstChange) {
      this.resetPage();
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.fetchPeopleChampionEmployees();
    this.getNumberOfEmployees();
  }

  createAndDisplayChart(): void {
    this.chartService.getAllCharts().subscribe({
      next: data => {
        data = this.configureChartColors(data);
        if (data.length > 0) {
          this.chartData = data;
          this.populateCanvasCharts();
          this.displayChart = true;
          this.selectedChartType = this.chartData[0].type;
        } else {
          this.chartData = [];
          this.displayChart = false;
          this.captureCharts.emit(0);
        }
      },
      error: () => {
        this.snackBarService.showSnackbar("Chart display unsuccessful", "snack-error");
      }
    });
  }

  getNumberOfEmployees(): void {
    this.employeeService.getTotalEmployees().subscribe({
      next: data => {
        this.numberOfEmployees = data;
      }
    });
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

  generateReport(index: number): void {
    if (this.chartData[index]) {
      this.showReport = true;
      this.updateFormData = this.chartData[index];
      this.selectedChartIndex = index;
    }
  }

  updateChart(): void {
    if (this.activeChart) {
      const updatedChart: ChartData = {
        ...this.activeChart,
        Name: this.updateFormData.Name,
        Type: this.updateFormData.Type,
      };
      this.chartService.updateChart(this.updateFormData).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Update successful", "snack-success");
          this.resetPage();
          this.createAndDisplayChart();
        },
        error: () => {
          this.snackBarService.showSnackbar("Update unsuccessful", "snack-error");

        }
      });
    }
  }

  editChart(index: number) {
    this.selectedChartIndex = index;
    this.activeChart = this.chartData[index];
    this.updateFormData = { ...this.activeChart };
    this.showUpdateForm = true;
  }

  deleteChart(selectedIndex: number): void {
    if (this.chartData[selectedIndex]) {
      this.chartService.deleteChart(this.chartData[selectedIndex].id).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Delete successful", "snack-success");
          this.resetPage();
          this.createAndDisplayChart();
        },
        error: () => {
          this.snackBarService.showSnackbar("Failed to delete graph", "snack-error");
        }
      });
    }
  }

  fetchPeopleChampionEmployees() {
    this.employeeService.filterEmployees(0, EmployeeType.PeopleChampion).subscribe({
      next: (employees: EmployeeProfile[]) => {
        employees.forEach((employee) => {
          if (employee.id) {
            this.employeeNames[employee.id] = `${employee.name} ${employee.surname}`;
          }
        });
      }, error: () => {
        this.snackBarService.showSnackbar("Failed to fetch people champion", "snack-error");
      }, complete: () => {
        this.createAndDisplayChart();
      },

    });
  }

  getEmployeeName(employeeId: string | undefined): string {
    const id = (employeeId || '').toString();
    if (this.employeeNames[id]) {
      return this.employeeNames[id];
    }
    return id;
  }

  populateCanvasCharts() {
    this.chartCanvasArray = [];
    this.chartCanvasArray.push();
    for (let i = 0; i < this.chartData.length; i++) {
      let dataset = [];

      if (this.chartData[i].type === 'pie') {
        const labelsArray: string[] = this.chartData[i].labels.map((label: string) => this.getEmployeeName(label));
        this.chartData[i].labels = labelsArray;
        dataset.push({
          data: this.chartData[i].dataSet[0],
          labels: labelsArray,
          backgroundColor: this.coloursArray

        });
      } else {
        if (this.chartData[i].labels) {
          for (let j = 0; j < this.chartData[i].labels.length; j++) {
            dataset.push({
              data: [this.chartData[i].datasets[0].data[j]],
              label: this.getEmployeeName(this.chartData[i].labels[j]),
              backgroundColor: this.coloursArray[j],
              borderColor: this.coloursArray[j],
            });
          }
        }
      }
      this.chartCanvasArray.push(dataset);
    }
  }

  configureChartColors(chartData: ChartData[]) {
    let colorIndex = 0
    chartData.forEach((chart: any) => {
      if (chart.subtype == "stacked") {
        chart.datasets?.forEach((dataset: any) => {
          dataset.backgroundColor = this.coloursArray[colorIndex];
          colorIndex++
        });
      } else {
        chart.datasets?.forEach((dataset: any) => {
          dataset.backgroundColor = this.coloursArray;
        });
      }
      colorIndex = 0;
    });
    return chartData;
  }

  pdfPreview(index: number) {
    const dialogRef = this.dialog.open(ChartReportPdfComponent, {
      maxWidth: '820px',
      data: {
        selectedChart: this.chartData[index],
        canvasData: this.chartCanvasArray[index]
      }
    });
    dialogRef.afterOpened().subscribe(() => {
      const dialogContainer = this.document.getElementsByClassName('mdc-dialog__surface')[0];
      this.renderer.setStyle(dialogContainer, 'overflow-x', 'hidden');
      this.renderer.setStyle(dialogContainer, 'overflow-y', 'auto');
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

