import { Component } from '@angular/core';
import { AccordionProfileComponent } from '../accordion-profile.component';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-accordion-profile-employee-details',
  templateUrl: './accordion-profile-employee-details.component.html',
  styleUrls: ['./accordion-profile-employee-details.component.css']
})
export class AccordionProfileEmployeeDetailsComponent extends AccordionProfileComponent {
  override ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeForm();
    this.initializeEmployeeProfileDto();
    this.getEmployeeFields();
    this.getClients();
    this.checkEmployeeDetails();
  }
}

