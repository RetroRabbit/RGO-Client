import { Component, Output, EventEmitter } from '@angular/core';
import { ChartService } from 'src/app/services/hris/charts.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
@Component({
  selector: 'app-create-charts',
  templateUrl: './create-charts.component.html',
  styleUrls: ['./create-charts.component.css']
})

export class CreateChartsComponent {
  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();

  chartName: string = 'Name';
  selectedDataItems: string[] = [];
  chartType: any = 'bar';
  chartData: number[] = [];
  chartLabels: string[] = [];
  columns: string[] = [];

  chartOptions: any = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  dropdownSettings = {
    singleSelection: false,
    text: 'Select Data Items',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    enableSearchFilter: true,
  };

  constructor(private ChartService: ChartService,
    private router: Router,
    private cookieService: CookieService,
    private snackBarService: SnackbarService, 
    private navService : NavService) {
  }

  ngOnInit(): void {
    this.getChartData();
    this.ChartService.getEmployeeTableColumns().subscribe({
      next: options => { this.columns = options; }
    });
  }

  createChart() {
    this.ChartService.createChart(this.selectedDataItems, this.selectedDataItems, this.chartName, this.chartType, this.navService.employeeProfile.id!)
      .subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Created", "snack-success");
          this.router.navigateByUrl('/charts')
          this.cookieService.set('currentPage', "Charts");
        },
        error: (er) => this.snackBarService.showError(er),
      }
    );
  }

  getChartData() {
    if (this.selectedDataItems && this.selectedDataItems.length > 0) {
      this.ChartService.getChartDataByType(this.selectedDataItems).subscribe({
        next: data => {
          this.chartData = data.data;
          this.chartLabels = data.labels;
        },
        error: (er) => this.snackBarService.showError(er),
      });
    } else {
      this.snackBarService.showSnackbar("Data Items Not Selected", "snack-error");
    }
  }

  onDropDownChange() {
    if (this.selectedDataItems && this.selectedDataItems.length > 0) {
      this.ChartService.getChartDataByType(this.selectedDataItems).subscribe({
        next: data => {
          this.chartData = data.data;
          this.chartLabels = data.labels;
        },
        error: (er) => this.snackBarService.showError(er),
      });
    } else {
      this.snackBarService.showSnackbar("Data Items Not Selected", "snack-error");
    }
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }
}
