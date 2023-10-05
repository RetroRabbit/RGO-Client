import { Component } from '@angular/core';
import { EmployeeProfileService } from 'src/app/services/employee-profile.service';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { Chart } from 'src/app/models/charts.interface';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent {
  selectedItem: string = 'Dashboard';
  menuClicked: boolean = false;
  admin !: EmployeeProfile;
  profileImage : string = '';
  charts: Chart[] = [];
  constructor(private employeeProfileService: EmployeeProfileService) { }
  ngOnInit() {
    this.employeeProfileService.GetEmployeeProfile().subscribe(data => {
      this.admin = data;
      this.profileImage = this.admin.photo;
      this.getPhoto();
    });
   // this.chartService.getAllCharts().subscribe(data => this.charts = data);
  }

  getPhoto() {
      
  }
}
