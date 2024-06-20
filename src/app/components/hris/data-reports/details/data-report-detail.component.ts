import { Component, HostListener} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataReport } from 'src/app/models/hris/data-report.interface';
import { DataReportColumns } from 'src/app/models/hris/data-report-columns.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';

@Component({
  selector: 'app-data-report-detail',
  templateUrl: './data-report-detail.component.html',
  styleUrls: ['./data-report-detail.component.css']
})

export class DataReportDetailComponent {

  baseUrl: string;
  dataReportCode: string;
  isLoading: boolean = false;
  dataObjects: DataReport = {};
  screenWidth = window.innerWidth;
  PREVIOUS_PAGE = 'previousPage';

  constructor(private router: Router,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService) {
    this.baseUrl = `${environment.HttpsBaseURL}/data-reports`
    this.dataReportCode = this.route.snapshot.params["code"]
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

  fetchReportData(reportCode: string): Observable<DataReport> {
    return this.httpClient.get<DataReport>(`${this.baseUrl}/get-data-report?code=${reportCode}`);
  }

  updateReportData(reportInput: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/update-report-input`, reportInput)
  }

  populateReportData(dataReportCode: string) {
    this.fetchReportData(dataReportCode).subscribe({
      next: data => {
        this.dataObjects.reportId = data.reportId;
        this.dataObjects.reportName = data.reportName;
        this.dataObjects.columns = data.columns;
        this.dataObjects.data = data.data;
        this.isLoading = false
      },
    })
  }

  onViewEmployee(employeeId: number): void {
    this.router.navigateByUrl('/profile/' + employeeId);
    this.cookieService.set(this.PREVIOUS_PAGE, '/data-reports/' + this.dataReportCode);
  }

  getProperty(obj: any, key: string): any {
    return obj[key];
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

    this.updateReportData(reportInput).subscribe({
      next: data => {
        this.snackBarService.showSnackbar("Report Updated", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Report Update Failed", "snack-error")
      }
    })
  }

  addColumn(){
    
  }
}