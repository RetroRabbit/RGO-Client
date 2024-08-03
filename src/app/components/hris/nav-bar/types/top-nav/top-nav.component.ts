import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Chart } from 'chart.js';
import { CookieService } from 'ngx-cookie-service';
import { ChartService } from 'src/app/services/hris/charts.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { DialogTypeData } from 'src/app/models/hris/dialog-type-data.model';
import { EmployeeBankingandstarterkitService } from 'src/app/services/hris/employee/employee-bankingandstarterkit.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent {

  [x: string]: any;

  title = 'HRIS';
  screenWidth: number;

  roles!: string[];
  selectedItem: string = 'Dashboard';
  charts: Chart[] = [];

  employeeType: { id?: number; name?: string } | undefined = {
    id: 0,
    name: '',
  };

  isLoading: boolean = false;
  showConfirmDialog: boolean = false;

  dialogTypeData!: Dialog;
  tempRoute: string = '';

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private chartService: ChartService,
    public router: Router,
    public cookieService: CookieService,
    public navService: NavService,
    public authAccessService: AuthAccessService,
    public employeeBankingandstarterkitService: EmployeeBankingandstarterkitService
  ) {
    this.screenWidth = window.innerWidth;
    this.dialogTypeData = new DialogTypeData().dialogTypeData;
    var test = authAccessService.getAuthTokenProfilePicture();
  }

  ngOnInit() {
    this.signIn();
    this.isLoading = true
    this.employeeBankingandstarterkitService.getAllBankingAndStarterkits();
  }

  signIn() {
    this.roles = [this.authAccessService.getRole()];
    this.navService.refreshEmployee();
    this.isLoading = false;
    if (
      this.authAccessService.isSupport()
    ) {    
      if (this.navService.employeeProfile?.id) {
        this.chartService.getEmployeeCharts(this.navService.employeeProfile.id).subscribe({
          next: (data: any) => (this.charts = data),
        });
      }
    }
  }

  searchQuery: string = '';
  handleSearchQuery(query: string) {
    this.searchQuery = query;
  }

  logout() {
    this.navService.showTopNavMenu = false;
    this.authAccessService.logout();
    this.router.navigateByUrl("/");
  }

  goToProfile() {
    this.router.navigateByUrl('/profile/' + this.navService.employeeProfile.id);
  }

  changeNav(route: string) {
    if (this.navService.unsavedChanges) {
      this.tempRoute = route;
      this.dialogTypeData = { type: 'save', title: 'Discard unsaved changes?', subtitle: '', confirmButtonText: 'Discard', denyButtonText: 'Back' }

      this.showConfirmDialog = true;
    } else {
      this.router.navigate([route]);
    }
  }

  switchToAts(route: string) {
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
  switchToHris(route: string) {
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

  hasAccessToAts(): boolean {
    return this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin() || this.authAccessService.isTalent() || this.authAccessService.isJourney();
  }

  hasAccessToApprovals(): boolean {
    return this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin();
  }

  dialogFeedBack(event: any) {
    this.showConfirmDialog = false;
    if (event) {
      this.navService.unsavedChanges = false;
      this.router.navigate([this.tempRoute]);
    }
  }
}
