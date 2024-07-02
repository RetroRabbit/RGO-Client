import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { DataReportList } from 'src/app/models/hris/data-report-list';
import { MatDialog } from '@angular/material/dialog';
import { DataReportingService } from 'src/app/services/hris/data-reporting.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeRoleService } from 'src/app/services/hris/employee/employee-role.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';

@Component({
    selector: 'app-data-reports',
    templateUrl: './data-reports.component.html',
    styleUrls: ['./data-reports.component.css']
})
export class DataReportsComponent {
    baseUrl: string;
    titleInput?: string;
    codeInput?: string;
    role: string[] = [];

    constructor(private router: Router, 
      private httpClient: HttpClient,
      private dialog: MatDialog,
      private dataReportingService: DataReportingService,
      private snackBarService: SnackbarService,
      private employeeRoleService: EmployeeRoleService,
      private authAccessService: AuthAccessService) {
      this.baseUrl = `${environment.HttpsBaseURL}/data-reports`
    }

    dataObjects: DataReportList[] = [
    ];

    screenWidth = window.innerWidth;

    @HostListener('window:resize', ['$event'])

    
    @ViewChild('dialogTemplate', { static: true })
    dialogTemplate!: TemplateRef<any>;
    
    onResize() {
      this.screenWidth = window.innerWidth;
    }

    ngOnInit() {
      this.onResize();
      this.getRole();
      this.populateDataReportList();
    }

    onViewReport(code: string): void {
      this.router.navigateByUrl('/data-reports/' + code);
    }

    getRole(){
      var email = this.authAccessService.getEmployeeEmail()
      this.employeeRoleService.getRoles(email).subscribe({
        next: data => {
          this.role = data
        }
      })
    }

    fetchDataReportList(): Observable<DataReportList[]>{
      return this.httpClient.get<DataReportList[]>(`${this.baseUrl}/get-data-report-list`);
    }

    populateDataReportList(){
      this.fetchDataReportList().subscribe({
        next: data => {
          this.dataObjects = data;
        }
      })
    }

    showAddReportModal(){
      this.dialog.open(this.dialogTemplate, {
        width: '500px',
      });
    }

    addReport(){
      var input = {
        reportId: 0,
        name: this.titleInput,
        code: this.codeInput
      }

      this.dataReportingService.addOrUpdateReport(input).subscribe({
        next: data => {
          this.populateDataReportList();
          this.dialog.closeAll();
          this.snackBarService.showSnackbar("Report Added", "snack-success")
        },
        error: error => {
          this.snackBarService.showSnackbar("Report Creation Failed", "snack-error")
        }
      })
    }
}