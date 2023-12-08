import { Component,Output, EventEmitter } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HideNavService } from 'src/app/services/hide-nav.service';


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
  chartOptions: any = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };
  columns: string[] = [];

  dropdownSettings = {
    singleSelection: false,
    text: 'Select Data Items',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    enableSearchFilter: true,
  };

  constructor(private ChartService: ChartService, private router: Router,private cookieService: CookieService,private snackBarService: SnackbarService, navService : HideNavService) {
    navService.showNavbar = true;
  }

  ngOnInit() : void {
    this.getChartData();
    this.ChartService.getColumns().subscribe({
      next: options => { this.columns = options; }
    });
  }

  createChart() {
    this.ChartService.createChart(this.selectedDataItems, this.selectedDataItems, this.chartName, this.chartType)
      .subscribe({
        next : response => {
          this.snackBarService.showSnackbar("Chart created", "snack-success");
          this.router.navigateByUrl('/charts')
          this.cookieService.set('currentPage', "Charts");
        },
        error: error => {
          this.snackBarService.showSnackbar("Failed to create chart", "snack-error");
        }}
      );
  }

  getChartData() {
    if (this.selectedDataItems && this.selectedDataItems.length > 0) {
      this.ChartService.getChartDataByType(this.selectedDataItems).subscribe({
        next: data => {
          this.chartData = data.data;
          this.chartLabels = data.labels;
        },
        error: error => {
          this.snackBarService.showSnackbar("Failed to get chart data", "snack-error");
        }
    });
    } else {
      this.snackBarService.showSnackbar("No data selected. Please select data items.", "snack-error");
    }
  }

  onDropDownChange() {
    if (this.selectedDataItems && this.selectedDataItems.length > 0) {
      this.ChartService.getChartDataByType(this.selectedDataItems).subscribe({
        next: data => {
          this.chartData = data.data;
          this.chartLabels = data.labels;
        },
        error: error => {
          this.snackBarService.showSnackbar("Failed to get chart data.", "snack-error");
        }
    });
    } else {
      this.snackBarService.showSnackbar("No data selected. Please select data items", "snack-error");
    }
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }
}
