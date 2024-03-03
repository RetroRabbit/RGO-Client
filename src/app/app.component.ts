import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { CookieService } from "ngx-cookie-service";
import { NavService } from 'src/app/services/hris/nav.service';
import { EmployeeProfile } from "./models/hris/employee-profile.interface";
import { Chart } from "chart.js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HRIS';
  showNav = this.navService.showNavbar;
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
    private auth: AuthService,
    public cookieService: CookieService,
    public navService: NavService)
    {
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

  searchQuery: string = '';
  handleSearchQuery(query: string) {
    this.searchQuery = query;
  }

  logout() {
    this.navService.showNavbar = false;
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }
  
}
