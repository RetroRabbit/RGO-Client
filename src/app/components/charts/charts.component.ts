import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { Chart } from 'src/app/models/charts.interface';
import { CookieService } from 'ngx-cookie-service';
import { colours } from '../../models/constants/colours.constants';
import { NgToastService } from 'ng-angular-popup';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ChartReportPdfComponent } from './chart-report-pdf/chart-report-pdf.component';
import { ChartConfiguration, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeService } from 'src/app/services/employee/employee.service';


@Component({
  selector: 'app-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})

export class ChartComponent implements OnInit {
  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();
  @Output() captureCharts = new EventEmitter<number>();
  @Input() chartsArray: Chart[] = [];
  selectedChartType: ChartType ='bar';
  displayChart: boolean = false;
  numberOfEmployees: number = 0;
  chartData: any[] = [];
  activeChart: any = null;
  employeeNames: { [id: string]: string } = {};
  showReport: boolean = false;
  showUpdateForm:boolean=false;
  updateFormData: any = {
      Name: '',
      Type:''
  }
  coloursArray : string[] = colours;
  chartCanvasArray: any[] = [];

  public pieChartPlugins = [ChartDataLabels];
  public barChartPlugins = [ChartDataLabels];

  selectedChartIndex: number = -1;
  constructor(private chartService: ChartService, private cookieService: CookieService,
    private toast: NgToastService, public dialog: MatDialog, private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document, private employeeProfile:EmployeeService, private snackBarService: SnackbarService) {}

    public barChartOptions: ChartConfiguration['options'] = {
      events: [],
      responsive: true,
      scales: {
        x: {},
        y: {
          min: 0,
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          anchor: 'middle',
          align: 'middle',
        } as any,
      },
    };

    public pieChartOptions: ChartConfiguration['options'] = {
      events: [],
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
    };

    resetPage(){
      this.displayChart = false
      this.chartData = [];
      this.activeChart = null;
      this.showReport  = false;
      this.showUpdateForm = false;
      this.chartCanvasArray = [];
      this.updateFormData  = {
          Name: '',
          Type:''
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
      error: error => {
        this.snackBarService.showSnackbar("Chart display unsuccessful", "snack-error");
       }
  });
  }

  getNumberOfEmployees(): void {
    this.chartService.getTotalEmployees().subscribe({
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

  generateReport(index : number): void {
    if (this.chartData[index]) {
      this.showReport = true;
      this.updateFormData = this.chartData[index];
      this.selectedChartIndex = index;
    }
  }

  updateChart(): void {

    if (this.activeChart) {
      const updatedChart: Chart = {
        ...this.activeChart,
        Name: this.updateFormData.Name,
        Type: this.updateFormData.Type,
      };
      this.chartService.updateChart(this.updateFormData).subscribe({
        next: (updatedData: any) => {
          this.snackBarService.showSnackbar("Update successful", "snack-success");
          this.resetPage();
          this.createAndDisplayChart();
        },
        error: error => {
          this.snackBarService.showSnackbar("Update unsuccessful", "snack-error");

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
    if (this.chartData[selectedIndex]) {
      this.chartService.deleteChart(this.chartData[selectedIndex].id).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Delete successful", "snack-success");
          this.resetPage();
          this.createAndDisplayChart();
        },
        error: error => {
          this.snackBarService.showSnackbar("Failed to delete graph", "snack-error");
        }
    });}}

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }

  fetchPeopleChampionEmployees() {
    this.employeeProfile.filterEmployeesByType("People Champion").subscribe({
      next :(employees: EmployeeProfile[]) => {
        employees.forEach((employee) => {
          if (employee.id) {
            this.employeeNames[employee.id] = `${employee.name} ${employee.surname}`;
          }
        });
  }, error: (error) => {

    this.snackBarService.showSnackbar("Failed to fetch people champion", "snack-error");

  }, complete: () => {
    this.createAndDisplayChart();
  },

});}

   getEmployeeName(employeeId: string | undefined): string {

    const id = (employeeId || '').toString();

    if (this.employeeNames[id]) {
      return this.employeeNames[id];
    }
    return id;

  }

  populateCanvasCharts() {
    this.chartCanvasArray = [];
    for (let i = 0; i < this.chartData.length; i++) {
      let dataset = [];

      if (this.chartData[i].type === 'pie') {
        const labelsArray: string[] = this.chartData[i].labels.map((label: string) => this.getEmployeeName(label));
        this.chartData[i].labels = labelsArray;
        dataset.push({
          data: this.chartData[i].data,
          labels: labelsArray,
        });
      } else {
        if (this.chartData[i].labels) {
          for (let j = 0; j < this.chartData[i].labels.length; j++) {
            dataset.push({
              data: [this.chartData[i].data[j]],
              label: this.getEmployeeName(this.chartData[i].labels[j]),
            });
          }
        }
      }
      this.chartCanvasArray.push(dataset);
    }
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

