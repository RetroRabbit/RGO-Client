import { Token } from "@angular/compiler";
import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { Store } from "@ngrx/store";
import { CookieService } from "ngx-cookie-service";
import { HideNavService } from 'src/app/services/hide-nav.service';
import { ChartService } from "./services/charts.service";
import { EmployeeProfileService } from "./services/employee/employee-profile.service";
import { EmployeeProfile } from "./models/employee-profile.interface";
import { Chart } from "chart.js";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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

  constructor(
    private employeeProfileService: EmployeeProfileService,
    private chartService: ChartService,
    private store: Store<{ app: Token }>,
    private auth: AuthService,
    public cookieService: CookieService,
    public hideNavService: HideNavService)
    {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    console.log(this.hideNavService.showNavbar)
    // this.hideNavService.showNavbar = false;
  }

  signIn(){
    this.hideNavService.showNavbar = true;
    const types: string = this.cookieService.get('userType');
    this.roles = Object.keys(JSON.parse(types));

    this.employeeProfileService.GetEmployeeProfile().subscribe({
      next: data => {
        this.employeeProfile = data;
        this.profileImage = this.employeeProfile.photo;
        this.employeeType = this.employeeProfile.employeeType;
      }
    });

    this.chartService.getAllCharts().subscribe({
      next: (data: any) => this.charts = data
    });
  }

  isAdmin(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('SuperAdmin');
  }

  isJourney(): boolean {
    return this.roles.includes('Journey');
  }

  isEmployee(): boolean {
    return this.roles.includes('Employee');
  }

  handleSelectedEmp(item: any){
   // this.selectedEmployee = item
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
  
}
