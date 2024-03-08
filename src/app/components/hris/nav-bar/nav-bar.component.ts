import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CookieService } from 'ngx-cookie-service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { ChartService } from 'src/app/services/hris/charts.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { Router } from '@angular/router';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { Chart } from 'chart.js';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
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
  constructor(
    private employeeProfileService: EmployeeProfileService,
    private chartService: ChartService,
    private auth: AuthService,
    public router: Router,
    public cookieService: CookieService,
    public navService: NavService,
    public authAccessService: AuthAccessService
  ) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.signIn();
  }

  signIn() {
    this.navService.showNavbar = true;
    const types: string = this.cookieService.get('userType');
    const userEmail = this.cookieService.get('userEmail');
    this.roles = Object.keys(JSON.parse(types));

    this.isLoading = true; 
      this.employeeProfileService.getSimpleEmployee(userEmail).subscribe({
      next: (data) => {
        this.employeeProfile = data;
        this.profileImage = this.employeeProfile.photo;
        this.employeeType = this.employeeProfile.employeeType;
        this.cookieService.set("userId", String(this.employeeProfile.id));
        this.isLoading = false;
        this.authAccessService.setUserId(Number(this.employeeProfile.id));
      },
      error: (error) => {
        this.isLoading = false;
      }
    });

    this.chartService.getAllCharts().subscribe({
      next: (data: any) => (this.charts = data),
    });
  }

  searchQuery: string = '';
  handleSearchQuery(query: string) {
    this.searchQuery = query;
  }

  logout() {
    this.navService.showNavbar = false;
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin },
    });
  }

  changeNav(route: string) {
    if (this.navService.unsavedChanges) {
      this.tempRoute = route;
      this.dialogTypeData = { type: 'save', title: 'Discard unsaved changes?', subtitle: '', confirmButtonText: 'Discard', denyButtonText: 'Back' }

      this.showConfirmDialog = true;
    } else {
      this.router.navigate([route]);
    }
  }

  switchToAts(route: string){
    if (this.navService.unsavedChanges) {
      this.tempRoute = route;
      this.dialogTypeData = { type: 'save', title: 'Discard unsaved changes?', subtitle: '', confirmButtonText: 'Discard', denyButtonText: 'Back' }

      this.showConfirmDialog = true;
    } else {  
      this.navService.isHris = false;
      this.cookieService.set("isHris", String(this.navService.isHris));
      this.router.navigate([route]);
    }
  }
  switchToHris(route: string){
    if (this.navService.unsavedChanges) {
      this.tempRoute = route;
     this.dialogTypeData = { type: 'save', title: 'Discard unsaved changes?', subtitle: '', confirmButtonText: 'Discard', denyButtonText: 'Back' }

      this.showConfirmDialog = true;
    } else {
      this.navService.isHris = true;
      this.cookieService.set("isHris", String(this.navService.isHris));
      this.router.navigate([route]);
    }
  }

  hasAccess(): boolean {
    return this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin() || this.authAccessService.isTalent() || this.authAccessService.isJourney();
  }

  dialogFeedBack(event: any) {
    this.showConfirmDialog = false;
    if (event) {
      this.navService.unsavedChanges = false;
      this.router.navigate([this.tempRoute]);
    } else {
    }
  }
}
