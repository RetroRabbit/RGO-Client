import { Component, EventEmitter, HostListener, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { ChartService } from 'src/app/services/hris/charts.service';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';

@Component({
  selector: 'app-ats-dashboard',
  templateUrl: './ats-dashboard.component.html',
  styleUrls: ['./ats-dashboard.component.css']
})
export class AtsDashboardComponent {
  @ViewChild('dialogTemplate', { static: true })
  dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() selectedEmployee = new EventEmitter<EmployeeProfile>();
  @Output() expandSearch = new EventEmitter<string>();

  isMobileScreen = false;
  PREVIOUS_PAGE: string = 'previousPage';

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private navService: NavService,
    public authAccessService: AuthAccessService) {
    navService.showNavbar = true;
  }

  screenWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
    this.screenWidth = window.innerWidth;
  }

  AddCandidate() {
    this.cookieService.set(this.PREVIOUS_PAGE, '/ats-dashboard');
    this.router.navigateByUrl('/create-candidate');
  }
}
