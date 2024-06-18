import { Component, HostListener, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataReport } from 'src/app/models/hris/data-report.interface';
import { DataReportColumns } from 'src/app/models/hris/data-report-columns.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-data-report-detail',
    templateUrl: './data-report-detail.component.html',
    styleUrls: ['./data-report-detail.component.css']
})
export class DataReportDetailComponent {
    
    baseUrl: string;
    dataReportCode: string;

    constructor(private router: Router,
      private httpClient: HttpClient,
      private cookieService: CookieService,
      private route: ActivatedRoute) {
        this.baseUrl = `${environment.HttpsBaseURL}/data-reports`
        this.dataReportCode = this.route.snapshot.params["code"]
    }

    dataObjects : DataReport = {
      reportName: "Open-Source Contributions Tracker",
      reportId: 0,
      columns: [],
      data: []
    }; // TODO : Pull this from back-end -> /data-reports/get-data-report?code=reportCode

    screenWidth = window.innerWidth;
    PREVIOUS_PAGE = 'previousPage';

    @HostListener('window:resize', ['$event'])
    
    onResize() {
      this.screenWidth = window.innerWidth;
    }

    ngOnInit() {
      this.onResize();
      this.populateReportData();
    }

    fetchReportData(reportCode: string): Observable<DataReport>{
      return this.httpClient.get<DataReport>(`${this.baseUrl}/get-data-report?code=${reportCode}`);
    }

    populateReportData(){
      this.fetchReportData("AS01").subscribe({
        next: data => {
          this.dataObjects.reportId = data.reportId;
          this.dataObjects.reportName = data.reportName;
          this.dataObjects.columns = data.columns;
          this.dataObjects.data = data.data;
        }
      })
    }

    onViewEmployee(employeeId: number): void {
      this.dataReportCode = this.route.snapshot.params["code"]
      this.router.navigateByUrl('/profile/' + employeeId);
      this.cookieService.set(this.PREVIOUS_PAGE, '/data-reports/'+ this.dataReportCode);

      //TODO : Set return path so user can navigate back to table view from employee view
    }

    getProperty(obj: any, key: string): any {
      return obj[key];
    }

    
    UpdateCustomInput(index: number, column: DataReportColumns, e: any) {
      var reportId = this.dataObjects.reportId
      var columnId = column.id;
      var employeeId = this.dataObjects.data[index].Id;
      var input = e.srcElement.value;

      this.dataObjects.data[index][column.prop] = input;
      
      //TODO : submit change to BE & provide popup to notify changes has been saved

      /*
      URL: /data-reports/update-report-input
      METHOD: POST
      BODY: {
              ReportId
              ColumnId
              EmployeeId
              Input
            }
      */
    }
}