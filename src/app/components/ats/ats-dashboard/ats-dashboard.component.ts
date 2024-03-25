import { Component, EventEmitter, HostListener, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';

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

  isLoading: boolean = true;
  isMobileScreen = false;
  PREVIOUS_PAGE: string = 'previousPage';
  

  constructor(
    private cookieService: CookieService,
    private router: Router,
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
    this.router.navigateByUrl('/create-candidate');
  }
}
