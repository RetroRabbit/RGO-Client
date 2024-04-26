import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { AuthService } from '@auth0/auth0-angular';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {

  [x: string]: any;

  title = 'HRIS';
  screenWidth!: number;

  roles!: string[];

  employeeProfile!: EmployeeProfile;
  profileImage: string = '';
  
  selectedItem: string = 'Dashboard';
  charts: Chart[] = [];

  employeeType: { id?: number; name?: string } | undefined = {
    id: 0,
    name: '',
  };

  isLoading: boolean = false;
  showConfirmDialog: boolean = false;
  showSideNav: boolean = false;
  isSectionVisible: boolean = false;

  dialogTypeData: Dialog = {
    type: '',
    title: '',
    subtitle: '',
    confirmButtonText: '',
    denyButtonText: '',
  };

  tempRoute: string = '';
  searchQuery: string = '';

  totalNumberOfEmployees: number = 0;

  constructor(
    public router: Router,
    public cookieService: CookieService,
    public navService: NavService,
    public authAccessService: AuthAccessService,
    private auth: AuthService,
    private employeeService: EmployeeService
  ) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.initialiseNavbar();
    this.employeeService.getTotalEmployees().subscribe({
      next: (numEmployees: number) => {
        this.totalNumberOfEmployees = numEmployees;
      },
    })
  }

  initialiseNavbar(){
    this.showSideNav = false;
    // const types: string = this.cookieService.get('userType');
    // const userEmail = this.cookieService.get('userEmail');
    // this.roles = Object.keys(JSON.parse(types));

    // this.isLoading = true; 
      // this.employeeProfileService.getSimpleEmployee(userEmail).subscribe({
      // next: (data) => {
      //   this.employeeProfile = data;
      //   this.profileImage = this.employeeProfile.photo;
      //   this.employeeType = this.employeeProfile.employeeType;
      //   this.cookieService.set("userId", String(this.employeeProfile.id));
      //   this.isLoading = false;
      //   this.authAccessService.setUserId(Number(this.employeeProfile.id));
      //   this.refreshEmployee();
      // },
      // error: () => {
      //   this.isLoading = false;
      // }
    // });

    // this.chartService.getAllCharts().subscribe({
    //   next: (data: any) => (this.charts = data),
    // });
  }

  switchToAts(route: string){
    if (this.navService.unsavedChanges) {
      this.tempRoute = route;
      this.dialogTypeData = { type: 'save', title: 'Discard unsaved changes?', subtitle: '', confirmButtonText: 'Discard', denyButtonText: 'Back' }

      this.showConfirmDialog = true;
    } else {  
      this.navService.isHris = false;
      this.cookieService.set("isHris", String(this.navService.isHris));
      this.router.navigate([route]);
    }
  }
  switchToHris(route: string){
    if (this.navService.unsavedChanges) {
      this.tempRoute = route;
     this.dialogTypeData = { type: 'save', title: 'Discard unsaved changes?', subtitle: '', confirmButtonText: 'Discard', denyButtonText: 'Back' }

      this.showConfirmDialog = true;
    } else {
      this.navService.isHris = true;
      this.cookieService.set("isHris", String(this.navService.isHris));
      this.router.navigate([route]);
    }
  }

  dialogFeedBack(event: any) {
    this.showConfirmDialog = false;
    if (event) {
      this.navService.unsavedChanges = false;
      this.router.navigate([this.tempRoute]);
    } 
  }

  toggleSideNav()
  {
    this.showSideNav = !this.showSideNav;
  }

  toggleSection()
  {
    this.isSectionVisible = !this.isSectionVisible;
  }

  hasAccessToAts(): boolean {
    return this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin() || this.authAccessService.isTalent() || this.authAccessService.isJourney();
  }

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin },
    });
  }
}
