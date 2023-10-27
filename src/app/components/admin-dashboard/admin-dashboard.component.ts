import { Component } from '@angular/core';
import { Chart } from 'src/app/models/charts.interface';
import { ChartService } from 'src/app/services/charts.service';
import { AuthService } from '@auth0/auth0-angular';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  charts: Chart[] = [];

  selectedItem: string = 'Dashboard';
  menuClicked: boolean = false;
  profileImage: string | null = null;
  initialDisplayCount: number = 3;
  displayAllEmployees: boolean = false;
  roles : string[] = [];

  employeeType: { id: number; name: string } = {
    id: 0,
    name: '',
  };

  searchQuery: string = '';
  searchResults: EmployeeProfile[] = [];
  allEmployees: EmployeeProfile[] = [];

  constructor(
    private employeeProfileService: EmployeeProfileService,
    private employeeService: EmployeeService,
    private chartService: ChartService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    const types: string = this.cookieService.get('userType');
    this.roles = Object.keys(JSON.parse(types));
    this.employeeService.getAllProfiles().subscribe((data) => {
      if (Array.isArray(data)) {
        this.allEmployees = data;
      } else if (data) {
        this.allEmployees = [data];
      }
      this.searchResults = [];

      console.log(this.allEmployees);
      

      if (
        this.admin.photo &&
        (this.admin.photo.startsWith('http') ||
          this.admin.photo.startsWith('data:image'))
      ) {
        this.profileImage = this.admin.photo;
      }
      this.employeeType = this.admin.employeeType;
    });

    this.employeeProfileService.getAllEmployees(this.searchQuery).subscribe((data) => {
      this.allEmployees = data;
    });

    this.chartService.getAllCharts().subscribe({
      next: (data) => (this.charts = data),
    });
  }

  isAdmin(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('SuperAdmin');
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }

  viewMoreEmployees() {
    this.displayAllEmployees = true;
  }

  searchEmployees() {
    if (this.searchQuery) {
      this.searchResults = this.allEmployees.filter(employee =>
          employee.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          employee.surname.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.activateSearchBar();
    } else {
      this.searchResults = [];
      this.deactivateSearchBar();
    }
  }
  
  activateSearchBar() {
    const searchBar = document.querySelector('.searchbar');
    searchBar?.classList.add('active');
    searchBar?.classList.remove('no-results');
  }
  
  deactivateSearchBar() {
    const searchBar = document.querySelector('.searchbar');
    searchBar?.classList.remove('active');
    searchBar?.classList.add('no-results');
  }
  
}