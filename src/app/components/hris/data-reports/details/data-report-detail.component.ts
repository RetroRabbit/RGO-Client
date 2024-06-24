import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataReport } from 'src/app/models/hris/data-report.interface';
import { DataReportColumns } from 'src/app/models/hris/data-report-columns.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { NavItem } from 'src/app/models/hris/report-menu-item.interface';
import { DataReportingService } from 'src/app/services/hris/data-reporting.service';
import { ReportColumnRequest } from 'src/app/models/hris/report-column-request.interface';


@Component({
  selector: 'app-data-report-detail',
  templateUrl: './data-report-detail.component.html',
  styleUrls: ['./data-report-detail.component.css']
})

export class DataReportDetailComponent {
  [x: string]: any;

  dataReportCode: string;
  isLoading: boolean = false;
  dataObjects: DataReport = {};
  screenWidth = window.innerWidth;
  PREVIOUS_PAGE = 'previousPage';
  isReorderable: boolean = true;

  navItems: NavItem[] = [];

  constructor(private router: Router,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    private dataReportingService: DataReportingService) {
    this.dataReportCode = this.route.snapshot.params["code"]
    this.dataReportingService.fetchMenuItems().subscribe({
      next: data => {
        this.navItems = data;
      }
    })
  }

  @HostListener('window:resize', ['$event'])

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.isLoading = true;
    this.onResize();
    this.dataReportCode = this.route.snapshot.params["id"]
    this.populateReportData(this.dataReportCode);
  }

  populateReportData(dataReportCode: string) {
    this.dataReportingService.fetchReportData(dataReportCode).subscribe({
      next: data => {
        this.dataObjects.reportId = data.reportId;
        this.dataObjects.reportName = data.reportName;
        this.dataObjects.columns = data.columns;
        this.dataObjects.data = data.data;
        this.isLoading = false;
        this.populateMenu()
      },
    })
  }

  populateMenu(){
    this.dataReportingService.fetchMenuItems().subscribe({
      next: data => {
        this.navItems = data;
      },
    })
  }

  onViewEmployee(employeeId: number): void {
    this.router.navigateByUrl('/profile/' + employeeId);
    this.cookieService.set(this.PREVIOUS_PAGE, '/data-reports/' + this.dataReportCode);
  }

  UpdateCustomInput(index: number, column: DataReportColumns, e: any) {
    var reportId = this.dataObjects.reportId
    var columnId = column.id;
    var employeeId = this.dataObjects.data![index].Id;
    var checkBoxChecked = e.srcElement.checked;
    var input = e.srcElement.value;

    if (checkBoxChecked == true) {
      input = "true";
    }
    if (checkBoxChecked == false) {
      input = "false"
    }

    this.dataObjects.data![index][column.prop] = input;

    var reportInput = {
      reportId: reportId,
      columnId: columnId,
      employeeId: employeeId,
      input: input
    }

    this.dataReportingService.updateReportData(reportInput).subscribe({
      next: data => {
        this.snackBarService.showSnackbar("Report Updated", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Report Update Failed", "snack-error")
      }
    })
  }

  moveColumn(event: any, dataReport: DataReport){
    var requestData: ReportColumnRequest = {
      id: event.columns[event.dropIndex].id,
      reportId: dataReport.reportId!,
      menuId: 0,
      sequence: event.dropIndex,
      name: ''
    }

    this.dataReportingService.moveColumnOnReport(requestData).subscribe({
      next: data => {
        this.snackBarService.showSnackbar("Report Updated", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Report Update Failed", "snack-error")
      }
    })
  }
}