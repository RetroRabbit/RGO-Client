import { Injectable } from '@angular/core';
import { EmployeeProfileService }  from '../../hris/employee/employee-profile.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { AuthAccessService } from '../auth-access/auth-access.service';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public showNavbar: boolean = false;
  public showSystemNavbar: boolean = true;
  public unsavedChanges: boolean = false;
  public isHris?: boolean;
  static showNavbar: boolean;
  public employeeProfile!:EmployeeProfile;

  constructor(private authAccessService: AuthAccessService, private employeeProfileService: EmployeeProfileService){
  }

  refreshEmployee(){
    this.employeeProfileService.getSimpleEmployee(this.authAccessService.getEmployeeEmail()).subscribe({
      next: (data) => {
        this.employeeProfile = data;
        console.log(this.employeeProfile);
      }
    });
  }
  
  getEmployeeProfile(){
    return this.employeeProfile;
  }
}
