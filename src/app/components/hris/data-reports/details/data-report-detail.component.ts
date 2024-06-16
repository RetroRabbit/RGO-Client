import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SystemNav } from 'src/app/services/hris/system-nav.service';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { Subscription, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';
import { ChartService } from 'src/app/services/hris/charts.service';
import { MatTableDataSource } from '@angular/material/table';
import { ChartData } from 'src/app/models/hris/charts.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, Validators } from '@angular/forms';
import { TemplateRef } from '@angular/core';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { EmployeeCountDataCard } from 'src/app/models/hris/employee-count-data-card.interface';
import { ChurnRateDataCard } from 'src/app/models/hris/churn-rate-data-card.interface';
import { ChartComponent } from '../../charts/charts.component';
import { Router } from '@angular/router';
import { DataReport } from 'src/app/models/hris/data-report.interface';
import { DataReportColumns } from 'src/app/models/hris/data-report-columns.interface';

@Component({
    selector: 'app-data-report-detail',
    templateUrl: './data-report-detail.component.html',
    styleUrls: ['./data-report-detail.component.css']
})
export class DataReportDetailComponent {
    
    constructor(private router: Router,) {
    }

    dataObjects : DataReport = {
      reportName: "Open-Source Contributions Tracker",
      reportId: 1,
      columns: [
        {
          id: 1,
          name: "Name",
          prop: "Name",
          sequence: 0,
          isCustom: false,
          fieldType: null
        },
        {
          id: 2,
          name: "Surname",
          prop: "Surname",
          sequence: 1,
          isCustom: false,
          fieldType: null
        },
        {
          id: 3,
          name: "Role",
          prop: "Role",
          sequence: 2,
          isCustom: false,
          fieldType: null
        },
        {
          id: 4,
          name: "Level",
          prop: "Level",
          sequence: 3,
          isCustom: false,
          fieldType: null
        },
        {
          id: 5,
          name: "Location",
          prop: "Location",
          sequence: 4,
          isCustom: false,
          fieldType: null
        },
        {
          id: 6,
          name: "NQF Level",
          prop: "NqfLevel",
          sequence: 5,
          isCustom: false,
          fieldType: null
        },
        {
          id: 7,
          name: "Open Source",
          prop: "OpenSource",
          sequence: 6,
          isCustom: true,
          fieldType: "Checkbox"
        },
        {
          id: 8,
          name: "Notes",
          prop: "Notes",
          sequence: 7,
          isCustom: true,
          fieldType: "Text"
        }
      ],
      data: [
        {
          Id: 2,
          Name: "Alicia",
          Surname: "Manders",
          Role: "Developer",
          Level: 4,
          Location: "Pretoria",
          NqfLevel: "NQF 5",
          OpenSource: "true",
          Notes: "false"
        }
      ]
    }; // TODO : Pull this from back-end -> /data-reports/get-data-report?code=reportCode

    screenWidth = window.innerWidth;

    @HostListener('window:resize', ['$event'])
    
    onResize() {
      this.screenWidth = window.innerWidth;
    }

    ngOnInit() {
      this.onResize();
    }

    onViewEmployee(employeeId: number): void {
      this.router.navigateByUrl('/profile/' + employeeId);
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