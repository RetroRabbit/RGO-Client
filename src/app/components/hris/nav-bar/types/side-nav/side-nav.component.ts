import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  [x: string]: any;
  title = 'HRIS';
  screenWidth!: number;
  roles!: string[];
  employeeProfile: EmployeeProfile | undefined;
  profileImage: string | undefined = '';
  selectedItem: string = 'Dashboard';
  charts: Chart[] = [];
  employeeType: { id?: number; name?: string } | undefined = {
    id: 0,
    name: '',
  };
  isLoading: boolean = false;
  showConfirmDialog: boolean = false;
  dialogTypeData: Dialog = {
    type: '',
    title: '',
    subtitle: '',
    confirmButtonText: '',
    denyButtonText: '',
  };
  tempRoute: string = '';
  searchQuery: string = '';

  constructor(
    public router: Router,
    public cookieService: CookieService,
    public navService: NavService,
    public authAccessService: AuthAccessService
  ) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    // this.navService.initialiseNavbar();
  }
}
