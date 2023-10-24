import { Component, HostListener } from '@angular/core';
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
  admin!: EmployeeProfile;
  profileImage: string | null = null;

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
    private auth: AuthService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
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

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin },
    });
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }

  searchEmployees() {
    if (this.searchQuery) {
      this.searchResults = this.allEmployees.filter(employee =>
          employee.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          employee.surname.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.searchResults = [];
    }
  }
}