import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Token } from 'src/app/models/token.interface';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Chart } from 'chart.js';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { ChartService } from 'src/app/services/charts.service';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  type$: Observable<Token> = this.store.select('app')
  selectedPage: string = this.cookieService.get("currentlPage") != "Dashboard" ? this.cookieService.get("currentlPage") : "Dashboard";
  selectedEvaluation: any | null = null
  roles: string[] = [];

  constructor(
    private employeeProfileService: EmployeeProfileService,
    private chartService: ChartService,
    private store: Store<{ app: Token }>,
    private auth: AuthService,
    public cookieService: CookieService
  ) { }

  selectedItem: string = 'Dashboard';
  menuClicked: boolean = false;
  admin !: EmployeeProfile;
  profileImage: string = '';
  charts: Chart[] = [];
  screenWidth !: number;

  employeeType: { id: number, name: string } = {
    id: 0,
    name: ''
  };

  ngOnInit() {
    this.selectedPage = this.cookieService.get('currentPage');
    const types: string = this.cookieService.get('userType');
    this.roles = Object.keys(JSON.parse(types));

    this.employeeProfileService.GetEmployeeProfile().subscribe({
      next: data => {
        this.admin = data;
        this.profileImage = this.admin.photo;
        this.employeeType = this.admin.employeeType;
      }
    });

    this.chartService.getAllCharts().subscribe({
      next: (data: any) => this.charts = data
    });

  }

  ngOnDestroy() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
  }

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }

  handleSelectedItem() {
    this.selectedPage = this.cookieService.get('currentPage');
  }

  handleSelectedEval(item: any) {
    this.selectedEvaluation = item
  }

  isAdmin(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('SuperAdmin');
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
    this.selectedItem = target.innerText;
  }
}
