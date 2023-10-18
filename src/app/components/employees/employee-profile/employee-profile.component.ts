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
  selectedItem: string = 'Profile Details';
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
    this.races = race;
    this.genders = gender;
    this.sizes = tshirtSize;
    this.nationalities = nationalities;
    this.disabilities = disabilities;
  }

  getEmployeeFields() {
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
  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.selectedItem = target.innerText;
  }

  setHasDisability(event: any) {
      this.hasDisbility = event.value;
  }

  editPersonalDetails(){
    this.editPersonal = true;
  }
  cancelPersonalEdit(){
    this.editPersonal = false;
    this.hasDisbility = false;
  }
}
