import { Component, HostListener, Input } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { SharedAccordionFunctionality } from '../../shared-accordion-functionality';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeQualificationsService } from 'src/app/services/hris/employee/employee-qualifications.service';
import { EmployeeQualifications } from 'src/app/models/hris/employee-qualifications.interface';

@Component({
  selector: 'app-career-summary',
  templateUrl: './accordion-career-summary.component.html',
  styleUrls: ['./accordion-career-summary.component.css']
})

export class CareerSummaryComponent {

  screenWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  usingProfile: boolean = true;
  qualifications : any = [1]
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }
  constructor(
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    private snackBarService: SnackbarService,
    private fb: FormBuilder,
    private employeeQualificationsService : EmployeeQualificationsService

  ) {
  }

  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    console.log(this.employeeProfile)
    this.initializeForm()
  }
  editQualificationsDetails(event : any) {
    console.log(event)
    this.sharedAccordionFunctionality.employeeQualificationForm.enable();
    this.sharedAccordionFunctionality.editQualifications = true;
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualifications", false)
  }
  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.sharedAccordionFunctionality.employeeQualificationForm.get(fieldName);
      if (control) {
        switch (this.sharedPropertyAccessService.checkPermission(table, fieldName)) {
          case PropertyAccessLevel.none:
            if (!initialLoad)
              control.disable();
            this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = false;
            break;
          case PropertyAccessLevel.read:
            if (!initialLoad)
              control.disable();
            this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = true;
            break;
          case PropertyAccessLevel.write:
            if (!initialLoad)
              control.enable();
            this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = true;
            break;
          default:
            if (!initialLoad)
              control.enable();
        }
      }
    });
  }
  saveQualificationsEdit(){}
  cancelQualificationsEdit(){
    this.sharedAccordionFunctionality.editQualifications = false;
    this.initializeForm();
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
  }
  initializeForm() {
    this.sharedAccordionFunctionality.employeeQualificationForm = this.fb.group({
      highestQualification: [this.employeeProfile!.employeeDetails.qualifications?.highestQualification?.trim(), [Validators.pattern(/^[0-9]*$/)]],
      school: [this.employeeProfile!.employeeDetails.qualifications?.school?.trim(), [Validators.pattern(/^[0-9]*$/)]],
      degree: [this.employeeProfile!.employeeDetails.qualifications?.degree?.trim(), [Validators.pattern(/^[0-9]*$/)]],
      fieldOfStudy: [this.employeeProfile!.employeeDetails.qualifications?.fieldOfStudy?.trim(), [Validators.pattern(/^[0-9]*$/)]],
      yearObtained: [this.employeeProfile!.employeeDetails.qualifications?.yearObtained?.trim(), [Validators.pattern(/^[0-9]*$/)]],
      nqfLevel: [this.employeeProfile!.employeeDetails.qualifications?.nqfLevel?.trim(), [Validators.pattern(/^[0-9]*$/)]],
       
    });
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
    this.sharedAccordionFunctionality.checkQualificationsFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();

    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualifications", true)
  }
  addQualification(){
    this.qualifications.push(1)
  }

  removeQualification(){
    this.qualifications.splice(0, 1);
  }
}


