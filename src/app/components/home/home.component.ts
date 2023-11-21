import { Component, OnDestroy  } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Token } from 'src/app/models/token.interface';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Chart } from 'chart.js';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { ChartService } from 'src/app/services/charts.service';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
import { EmployeeDate } from 'src/app/models/employee-date.interface';
import { HideNavService } from 'src/app/services/hide-nav.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent{
  showNav = this.hideNavService.showNavbar;
  type$: Observable<Token> = this.store.select('app')
  selectedEvaluation: any | null = null
  selectedEvent: EmployeeDate | null = null;
  selectedEmployee: EmployeeProfile | null = null;
  selectedItem: string = 'Dashboard';
  menuClicked: boolean = false;
  employeeProfile: EmployeeProfile | undefined;
  profileImage: string | undefined = '';
  charts: Chart[] = [];
  roles : string[] = [];
  screenWidth !: number;
  employeeType: { id?: number, name?: string } | undefined = {
    id: 0,
    name: ''
  };

  constructor(
    private employeeProfileService: EmployeeProfileService,
    private chartService: ChartService,
    private store: Store<{ app: Token }>,
    private auth: AuthService,
    public cookieService: CookieService,
    public hideNavService: HideNavService)
    {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    const types: string = this.cookieService.get('userType');
    this.roles = Object.keys(JSON.parse(types));

    this.employeeProfileService.GetEmployeeProfile().subscribe({
      next: data => {
        this.employeeProfile = data;
        this.profileImage = this.employeeProfile.photo;
        this.employeeType = this.employeeProfile.employeeType;
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

  handleSelectedEval(item: any) {
    this.selectedEvaluation = item
  }

  populateAddEmployeeForm(event: any) {
    this.selectedEvent = event;
  }

  viewProfile: EmployeeProfile | null = null;

  handleViewProfile(emp: EmployeeProfile) {
    this.viewProfile = emp;
  }

  shouldDisplayNewEmployee: boolean = false;

  onAddEmployee(): void {
    this.shouldDisplayNewEmployee = true;
  }

  onManageEmployee(): void {
    this.shouldDisplayNewEmployee = true;
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

  handleSelectedEmp(item: any){
    this.selectedEmployee = item
  }

  searchQuery: string = '';
  handleSearchQuery(query: string) {
    this.searchQuery = query;
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
    this.selectedItem = target.innerText;
    this.selectedEmployee = null;
    this.shouldDisplayNewEmployee = false;
  }
}