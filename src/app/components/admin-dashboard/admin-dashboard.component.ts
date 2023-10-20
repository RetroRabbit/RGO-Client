import { Component } from '@angular/core';
import { Chart } from 'src/app/models/charts.interface';
import { ChartService } from 'src/app/services/charts.service';
import { AuthService } from '@auth0/auth0-angular';
import { CookieService } from 'ngx-cookie-service';

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
  roles : string[] = [];

  employeeType: { id: number; name: string } = {
    id: 0,
    name: '',
  };

  constructor(
    private chartService: ChartService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    const types: string = this.cookieService.get('userType');
    this.roles = Object.keys(JSON.parse(types));

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
}
