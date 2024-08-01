import { Component, HostListener } from "@angular/core";
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
    private authAccess: AuthAccessService,
    public navService: NavService){
      this.screenWidth = window.innerWidth;
  }

  handleSearchQuery(query: string) {
    this.searchQuery = query;
  }

  logout() {
    this.authAccess.logout();
  }

  hasSignedIn(): boolean 
  {
    return this.authAccess.hasSignedIn();
  }
}
