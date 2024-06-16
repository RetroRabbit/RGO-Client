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

@Component({
    selector: 'app-data-reports',
    templateUrl: './data-reports.component.html',
    styleUrls: ['./data-reports.component.css']
})
export class DataReportsComponent {
    
    constructor(private router: Router,) {
    }

    dataObjects = [
        { name: "Availability Snapshot", code: "AS01"},
        { name: "Open-Source Contributions Tracker", code: "OSCT01"},
    ]; // TODO : Pull this from back-end -> /data-reports/get-data-report-list

    screenWidth = window.innerWidth;

    @HostListener('window:resize', ['$event'])
    
    onResize() {
      this.screenWidth = window.innerWidth;
    }

    ngOnInit() {
      this.onResize();
    }

    onViewReport(code: string): void {
      this.router.navigateByUrl('/data-reports/' + code);
    }
}