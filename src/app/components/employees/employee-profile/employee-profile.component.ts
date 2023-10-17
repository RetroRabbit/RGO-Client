import { Component } from '@angular/core';
import { AccessPropertiesService } from 'src/app/services/access-properties.service';
import { Properties } from 'src/app/models/properties.interface';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
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

  constructor(private accessPropertyService: AccessPropertiesService,
    private cookieService: CookieService,
    private employeeProfileService : EmployeeProfileService) { }

  ngOnInit() {
    this.getEmployeeFields();
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
}
