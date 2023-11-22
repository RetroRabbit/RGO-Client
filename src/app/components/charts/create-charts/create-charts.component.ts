import { Component,Output, EventEmitter } from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


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

  constructor(private ChartService: ChartService,private toast: NgToastService, private router: Router,private cookieService: CookieService) {}

  ngOnInit() : void {
    this.getChartData();
    this.ChartService.getColumns().subscribe({
      next: options => { this.columns = options; }
    });
  }

  createChart() {
    this.ChartService.createChart(this.selectedDataItems, this.chartName, this.chartType)
      .subscribe({
        next : response => {
          this.toast.success({detail:"Success",summary:'Chart created',duration:5000, position:'topCenter'});
          this.cookieService.set('currentPage', "Charts");
        },
        error: error => {
            this.toast.error({detail:"Error", summary:"Failed to create chart.",duration:5000, position:'topCenter'});
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
          this.toast.error({
            detail: "Error",
            summary: "Failed to get chartData.",
            duration: 5000,
            position: 'topCenter'
          });
        }
    });
    } else {
      this.toast.info({
        detail: "No data selected.",
        summary: "Please select data items.",
        duration: 5000,
        position: 'topCenter'
      });
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
          this.toast.error({
            detail: "Error",
            summary: "Failed to get chartData.",
            duration: 5000,
            position: 'topCenter'
          });
        }
    });
    } else {
      this.toast.info({
        detail: "No data selected.",
        summary: "Please select data items.",
        duration: 5000,
        position: 'topCenter'
      });
    }
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }
}
