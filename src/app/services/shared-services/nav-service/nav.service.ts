import { Injectable } from '@angular/core';
import { EmployeeProfileService }  from '../../hris/employee/employee-profile.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { AuthAccessService } from '../auth-access/auth-access.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public showNavbar: boolean = false;
  public showSideBar: boolean = false;
  public showSystemNavbar: boolean = true;
  public unsavedChanges: boolean = false;
  public isHris: boolean = true;
  public employeeProfile!:EmployeeProfile | SimpleEmployee;

  public expandSideNav: boolean = false;
  public showNavContainer: boolean = true;
  public showTopNavMenu: boolean = false;

  constructor(
    private authAccessService: AuthAccessService,
    private employeeProfileService: EmployeeProfileService,
  )
  { }

  refreshEmployee() {
    this.employeeProfileService.getSimpleEmployee(this.authAccessService.getEmployeeEmail()).subscribe({
      next: (data) => {
        this.employeeProfile = data;
        this.authAccessService.setUserId(this.employeeProfile.id as number);
      }
    });
  }
  
  public getEmployeeProfile() {
    return this.employeeProfile;
  }

  public hideNav() {
    this.showNavContainer = false;
  }

  public showNav() {
    this.showNavContainer = true;
  }

  public toggleSideBar() {
    this.expandSideNav = !this.expandSideNav;
  }
}