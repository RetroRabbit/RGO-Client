import { Component, HostListener, Input } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeQualificationsService } from 'src/app/services/hris/employee/employee-qualifications.service';
import { EmployeeQualifications } from 'src/app/models/hris/employee-qualifications.interface';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { error } from 'console';

@Component({
  selector: 'app-career-summary-qualifications',
  templateUrl: './accordion-career-summary-qualifications.component.html',
  styleUrls: ['./accordion-career-summary-qualifications.component.css']
})

export class CareerSummaryQualificationsComponent {

  screenWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])
 
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    private snackBarService: SnackbarService,
    private fb: FormBuilder,
    private employeeQualificationsService : EmployeeQualificationsService,
    public navservice: NavService
  ) {
  }

  usingProfile: boolean = true;

  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeForm();
  }

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  initializeForm() {
    this.sharedAccordionFunctionality.employeeQualificationForm = this.fb.group({
      highestQualification: [this.employeeProfile!.employeeDetails.qualifications?.highestQualification, Validators.required],
      school: [this.employeeProfile!.employeeDetails.qualifications?.school, Validators.required],
      fieldOfStudy: [this.employeeProfile!.employeeDetails.qualifications?.fieldOfStudy, Validators.required],
      yearObtained: [this.employeeProfile!.employeeDetails.qualifications?.yearObtained, Validators.required],
      nqfLevel: [this.employeeProfile!.employeeDetails.qualifications?.nqfLevel, Validators.required],
    });
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
    this.sharedAccordionFunctionality.checkQualificationsFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualifications", true)
  }  
  
  editQualificationsDetails() {
    this.sharedAccordionFunctionality.editQualifications = true;
    this.sharedAccordionFunctionality.employeeQualificationForm.enable();
  }

  fetchQualifications() {
   
  }

  saveQualificationsEdit() {
    if (this.sharedAccordionFunctionality.employeeQualificationForm.valid) {
      const employeeQualificationFormValue = this.sharedAccordionFunctionality.employeeQualificationForm.value;
      this.sharedAccordionFunctionality.employeeQualificationDto.id = 0;
      this.sharedAccordionFunctionality.employeeQualificationDto.employeeId = this.navservice.employeeProfile.id || this.employeeProfile.employeeDetails.id;
      this.sharedAccordionFunctionality.employeeQualificationDto.highestQualification = employeeQualificationFormValue.highestQualification.id;
      this.sharedAccordionFunctionality.employeeQualificationDto.school = employeeQualificationFormValue.school;
      this.sharedAccordionFunctionality.employeeQualificationDto.fieldOfStudy = employeeQualificationFormValue.fieldOfStudy;
      this.sharedAccordionFunctionality.employeeQualificationDto.yearObtained = employeeQualificationFormValue.yearObtained;
      this.sharedAccordionFunctionality.employeeQualificationDto.nqfLevel = employeeQualificationFormValue.nqfLevel.id;
      this.employeeQualificationsService.saveEmployeeQualification(this.sharedAccordionFunctionality.employeeQualificationDto).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Qualifications saved", "snack-success");
          this.sharedAccordionFunctionality.checkQualificationsFormProgress();
          this.sharedAccordionFunctionality.totalProfileProgress();
          this.sharedAccordionFunctionality.employeeQualificationForm.disable();
          this.sharedAccordionFunctionality.editQualifications = false;
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error.error, "snack-error");
        },
      });
    }
    else {
      this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
    }
  }

  cancelQualificationsEdit(){
    this.sharedAccordionFunctionality.editQualifications = false;
    this.initializeForm();
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
  }

  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.sharedAccordionFunctionality.personalDetailsForm.get(fieldName);

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
}



