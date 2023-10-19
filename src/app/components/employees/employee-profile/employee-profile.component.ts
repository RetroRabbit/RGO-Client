import { Component } from '@angular/core';
import { AccessPropertiesService } from 'src/app/services/access-properties.service';
import { Properties } from 'src/app/models/properties.interface';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
import { race } from 'src/app/models/constants/race.constants';
import { gender } from 'src/app/models/constants/gender.constants';
import { tshirtSize } from 'src/app/models/constants/tshirt.constants';
import { nationalities } from 'src/app/models/constants/nationaility.constants';
import { disabilities } from 'src/app/models/constants/disabilities.constant';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  EmployeeFields: Properties[] = [];
  EditFields: Properties[] = [];
  EmployeeProfile !: EmployeeProfile;
  isEdit: boolean = false;
  selectedItem: string = 'Profile Details'; // set the default accordion to Profile Details
  expandedIndex = 0;  
  panelOpenState : boolean = false;
  races : any[] = [];
  genders : any[] = [];
  sizes : any[] = [];
  nationalities : any[] = [];
  hasDisbility : boolean = false;
  disabilities: any[] = [];

  editPersonal : boolean = false;
  constructor(private accessPropertyService: AccessPropertiesService,
    private cookieService: CookieService,
    private employeeProfileService : EmployeeProfileService) { }

  ngOnInit() {
    this.getEmployeeFields();
    // populating constants
    this.races = race;
    this.genders = gender;
    this.sizes = tshirtSize;
    this.nationalities = nationalities;
    this.disabilities = disabilities;
  }

  getEmployeeFields() {
    // get the employee data
    this.accessPropertyService.GetAccessProperties(this.cookieService.get('userEmail')).subscribe({
      next: data => {
        this.EmployeeFields = data;
      }
    });
    this.employeeProfileService.GetEmployeeProfile().subscribe({
      next: data => {
        this.EmployeeProfile = data;
      }
    });
  }
  // This is for the accordion nav 
  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.selectedItem = target.innerText;
  }
  
  // Setting the bool for conditional rendering
  setHasDisability(event: any) {
      this.hasDisbility = event.value;
  }
  // When they click on the edit button
  editPersonalDetails(){
    this.editPersonal = true;
  }
  // Does nothing for now
  savePersonalEdit(){
    this.editPersonal = false;
  }

  // Grey out the values is cancelling an edit
  cancelPersonalEdit(){
    this.editPersonal = false;
    this.hasDisbility = false;
  }
}

/*
  The css properties should apply to reusable as along as the id or class relates with what is in the file
*/
