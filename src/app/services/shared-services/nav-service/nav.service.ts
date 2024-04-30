import { Injectable } from '@angular/core';
import { EmployeeProfileService }  from '../../hris/employee/employee-profile.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { AuthAccessService } from '../auth-access/auth-access.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public showNavbar: boolean = false;
  public showSideBar: boolean = false;
  public showSystemNavbar: boolean = true;
  public unsavedChanges: boolean = false;
  public isHris?: boolean;
  public employeeProfile!:EmployeeProfile;

  // private tempShowNavBar: boolean = false;
  // private tempShowSideNav: boolean = false;
  public expandSideNav: boolean = false;
  public showNavContainer: boolean = true;

  constructor(private authAccessService: AuthAccessService, private employeeProfileService: EmployeeProfileService,
    private cookieService: CookieService
  )
  { }

  refreshEmployee() {
    this.employeeProfileService.getSimpleEmployee(this.authAccessService.getEmployeeEmail()).subscribe({
      next: (data) => {
        this.employeeProfile = data;
        this.authAccessService.setUserId(this.employeeProfile.id as number);
        this.cookieService.set("userId", String(this.employeeProfile.id));
      }
    });
  }
  
  public getEmployeeProfile() {
    return this.employeeProfile;
  }

  public hideAll() {
    // this.tempShowNavBar = this.showNavbar;
    // this.tempShowSideNav = this.showSideBar;

    // this.showNavbar = this.showSideBar = false;
    this.showNavContainer = false;
  }

  public showAll() {
    // this.showNavbar = this.tempShowNavBar;
    // this.showSideBar = this.tempShowSideNav;
    this.showNavContainer = true;
  }

  public toggleSideBar() {
    this.expandSideNav = !this.expandSideNav;
  }
}