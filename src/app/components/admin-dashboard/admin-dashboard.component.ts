import { Component } from '@angular/core';
import { EmployeeProfileService } from 'src/app/services/employee-profile.service';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { Chart } from 'src/app/models/charts.interface';
import { ChartService } from 'src/app/services/charts.service';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent {
  selectedItem: string = 'Dashboard';
  menuClicked: boolean = false;
  admin !: EmployeeProfile;
  profileImage: string = '';
  charts: Chart[] = [];
  employeeType: { id: number, name: string } = {
    id: 0,
    name: ''
  };
  constructor(private employeeProfileService: EmployeeProfileService, 
    private chartService: ChartService,
    private auth: AuthService) { }
  ngOnInit() {
    this.employeeProfileService.GetEmployeeProfile().subscribe(data => {
      this.admin = data;
      this.profileImage = this.admin.photo;
      this.employeeType = this.admin.employeeType;
    });
    this.chartService.getAllCharts().subscribe(data => this.charts = data);
  }

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }
}
