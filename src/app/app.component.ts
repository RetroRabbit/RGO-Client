import { Component, HostListener } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { CookieService } from "ngx-cookie-service";
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { EmployeeProfile } from "./models/hris/employee-profile.interface";
import { Chart } from "chart.js";
import { AuthAccessService } from "./services/shared-services/auth-access/auth-access.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    this.navService.showNavbar = window.innerWidth > 610;
    this.navService.showSideBar = window.innerWidth <= 610;
  }
  
  title = 'HRIS';
  showNav = this.navService.showNavbar;
  screenWidth !: number;
  roles!: string[];
  employeeProfile: EmployeeProfile | undefined;
  profileImage: string | undefined = '';
  selectedItem: string = 'Dashboard';
  searchQuery: string = '';
  charts: Chart[] = [];

  employeeType: { id?: number, name?: string } = {
    id: 0,
    name: ''
  };


  constructor(
    private auth: AuthService,
    private authAccess: AuthAccessService,
    public cookieService: CookieService,
    public navService: NavService){
      this.screenWidth = window.innerWidth;
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

  handleSearchQuery(query: string) {
    this.searchQuery = query;
  }

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }

  hasSignedIn(): boolean 
  {
    return this.authAccess.getEmployeeEmail() != "";
  }
}
