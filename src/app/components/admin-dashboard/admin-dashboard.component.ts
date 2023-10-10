import { Component, HostListener } from '@angular/core';
import { Chart } from 'src/app/models/charts.interface';
import { ChartService } from 'src/app/services/charts.service';
import { AuthService } from '@auth0/auth0-angular';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  charts: Chart[] = [];

  constructor(
    private chartService: ChartService,
    private auth: AuthService,
    public cookieService: CookieService) {}

  ngOnInit() {
    this.chartService.getAllCharts().subscribe({
      next: data => this.charts = data
    });
  selectedItem: string = 'Dashboard';
  menuClicked: boolean = false;
  admin!: EmployeeProfile;
  profileImage: string | null = null;
  charts: Chart[] = [];
  screenWidth!: number;

  employeeType: { id: number; name: string } = {
    id: 0,
    name: '',
  };
  constructor(
    private employeeProfileService: EmployeeProfileService,
    private chartService: ChartService,
    private auth: AuthService,
    private cookieService: CookieService,
    private router: Router,
  ) {
    this.screenWidth = window.innerWidth;
  }
  ngOnInit() {
    this.employeeProfileService.GetEmployeeProfile().subscribe((data) => {
      this.admin = data;

      if (this.admin.photo &&
        (this.admin.photo.startsWith('http') || this.admin.photo.startsWith('data:image'))) {
        this.profileImage = this.admin.photo;
      }
      this.employeeType = this.admin.employeeType;
    });
    this.chartService.getAllCharts().subscribe((data) => (this.charts = data));
  }

  goToAddNewHire() {
    this.router.navigateByUrl('/new-employee');
  }

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin },
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }
}
