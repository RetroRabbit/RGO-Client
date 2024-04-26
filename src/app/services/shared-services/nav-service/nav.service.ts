import { Injectable } from '@angular/core';
import { EmployeeProfileService }  from '../../hris/employee/employee-profile.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { AuthAccessService } from '../auth-access/auth-access.service';

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

  private tempShowNavBar: boolean = false;
  private tempShowSideNav: boolean = false;
  public expandSideNav: boolean = false;

  constructor(private authAccessService: AuthAccessService, private employeeProfileService: EmployeeProfileService)
  { }

  refreshEmployee(){
    this.employeeProfileService.getSimpleEmployee(this.authAccessService.getEmployeeEmail()).subscribe({
      next: (data) => {
        this.employeeProfile = data;
      }
    });
  }
  
  public getEmployeeProfile(){
    return this.employeeProfile;
  }

  hideAll()
  {
    this.tempShowNavBar = this.showNavbar;
    this.tempShowSideNav = this.showSideBar;

    this.showNavbar = this.showSideBar = false;
  }

  showAll()
  {
    this.showNavbar = this.tempShowNavBar;
    this.showSideBar = this.tempShowSideNav;
  }

  toggleSideBar(){
    this.expandSideNav = !this.expandSideNav;
  }
}