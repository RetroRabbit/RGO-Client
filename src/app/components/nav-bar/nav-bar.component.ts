
import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { CookieService } from "ngx-cookie-service";
import { HideNavService } from 'src/app/services/hide-nav.service'; // use this service
import { ChartService } from "src/app/services/charts.service";
import { EmployeeProfileService } from "src/app/services/employee/employee-profile.service";
import { Router } from '@angular/router';
import { EmployeeProfile } from "src/app/models/employee-profile.interface";
import { Chart } from "chart.js";
import { Dialog } from 'src/app/models/confirm-modal.interface';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  [x: string]: any;

  title = 'HRIS';
  showNav = this.hideNavService.showNavbar;
  screenWidth !: number;
  roles!: string[];
  employeeProfile: EmployeeProfile | undefined;
  profileImage: string | undefined = '';
  selectedItem: string = 'Dashboard';
  charts: Chart[] = [];
  employeeType: { id?: number, name?: string } | undefined = {
    id: 0,
    name: ''
  };

  showConfirmDialog: boolean = false;
  dialogTypeData: Dialog = { type: '', title: '', subtitle: '', confirmButtonText: '', denyButtonText: '' };
  tempRoute: string = '';
  constructor(
    private employeeProfileService: EmployeeProfileService,
    private chartService: ChartService,
    private auth: AuthService,
    public router: Router,
    public cookieService: CookieService,
    public hideNavService: HideNavService) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.signIn();
  }

  signIn() {
    this.hideNavService.showNavbar = true;
    const types: string = this.cookieService.get('userType');
    const userEmail = this.cookieService.get('userEmail');
    this.roles = Object.keys(JSON.parse(types));

    this.employeeProfileService.GetEmployeeProfileByEmail(userEmail).subscribe({
      next: (data) => {
        this.employeeProfile = data;
        this.profileImage = this.employeeProfile.photo;
        this.employeeType = this.employeeProfile.employeeType;
        this.cookieService.set("userId", String(this.employeeProfile.id));
      }
    });

    this.chartService.getAllCharts().subscribe({
      next: (data: any) => this.charts = data
    });
  }

  isAdmin(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('SuperAdmin');
  }

  isTalent(): boolean {
    return this.roles.includes('Talent');
  }

  isEmployee(): boolean {
    return this.roles.includes('Employee');
  }

  searchQuery: string = '';
  handleSearchQuery(query: string) {
    this.searchQuery = query;
  }

  logout() {
    this.hideNavService.showNavbar = false;
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }
  
  changeNav(route: string) {

    if (this.hideNavService.unsavedChanges) {
      this.tempRoute = route;
      this.dialogTypeData = { type: 'save', title: 'Discard unsaved changes', subtitle: '', confirmButtonText: 'DISCARD', denyButtonText: 'BACK' }

      this.showConfirmDialog = true;
    } else {
      this.router.navigate([route]);
    }
  }

  dialogFeedBack(event: any) {
    this.showConfirmDialog = false;
    if (event) {
      this.hideNavService.unsavedChanges = false;
      this.router.navigate([this.tempRoute]);
    } else {
    }
  }

}
