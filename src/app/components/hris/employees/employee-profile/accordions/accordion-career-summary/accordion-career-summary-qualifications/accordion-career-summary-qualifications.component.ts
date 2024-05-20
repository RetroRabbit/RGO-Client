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

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

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
    console.log(this.employeeProfile);
    this.initializeForm();
  }

  initializeForm() {
    this.sharedAccordionFunctionality.employeeQualificationForm = this.fb.group({
      highestQualification: [this.employeeProfile!.employeeDetails.qualifications?.highestQualification, [Validators.required]],
      school: [this.employeeProfile!.employeeDetails.qualifications?.school, [Validators.required]],
      degree: [this.employeeProfile!.employeeDetails.qualifications?.degree, [Validators.required]],
      fieldOfStudy: [this.employeeProfile!.employeeDetails.qualifications?.fieldOfStudy, [Validators.required]],
      yearObtained: [this.employeeProfile!.employeeDetails.qualifications?.yearObtained, [Validators.pattern(/^(19|20)\d{2}$/), Validators.required]],
      nqfLevel: [this.employeeProfile!.employeeDetails.qualifications?.nqfLevel, [Validators.required]],
    });

    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
    this.sharedAccordionFunctionality.checkQualificationsFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();
    this.fetchQualifications();
    //this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualifications", true)
  }

  fetchQualifications() {
    const employeeId = this.navservice.employeeProfile.id!; // Assuming this is how you get the employee ID
    if (employeeId != 0) {
      this.employeeQualificationsService.getEmployeeQualificationById(employeeId).subscribe({
        next: (qualifications: EmployeeQualifications) => {
          console.log(qualifications)
          this.sharedAccordionFunctionality.employeeQualificationForm.patchValue(qualifications);
          this.sharedAccordionFunctionality.employeeQualificationForm.disable();
        },
        error: (error) => {
          console.error("Failed to fetch qualifications:", error); // Log the error for debugging
          this.snackBarService.showSnackbar("Failed to load qualifications.", "snack-error");
        }
      });
    }
  }

  saveQualificationsEdit() {
    const updatedQualifications: EmployeeQualifications = {
      id: this.employeeProfile!.employeeDetails.qualifications?.id || 0,
      highestQualification: this.sharedAccordionFunctionality.employeeQualificationForm.value.highestQualification,
      school: this.sharedAccordionFunctionality.employeeQualificationForm.value.school,
      degree: this.sharedAccordionFunctionality.employeeQualificationForm.value.degree,
      fieldOfStudy: this.sharedAccordionFunctionality.employeeQualificationForm.value.fieldOfStudy,
      yearObtained: this.sharedAccordionFunctionality.employeeQualificationForm.value.yearObtained,
      nqfLevel: this.sharedAccordionFunctionality.employeeQualificationForm.value.nqfLevel,
      employeeId: this.navservice.employeeProfile.id
    };

    if (this.employeeProfile.employeeDetails.qualifications?.id == 0) {
      this.employeeQualificationsService.saveEmployeeQualification(updatedQualifications).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Qualification saved successfully!", "snack-succes");
          this.initializeForm();
        },
        error: (error) => {
          this.snackBarService.showSnackbar("Failed to save qualification.", "snack-error");
          this.sharedAccordionFunctionality.employeeQualificationForm.markAllAsTouched();
        }
      });
    } else{
      this.employeeQualificationsService.updateEmployeeQualification(updatedQualifications, updatedQualifications.id).subscribe({
        next:() => {
          this.snackBarService.showSnackbar("Qualification saved successfully!", "snack-succes");
        },
        error: () => {
          this.snackBarService.showSnackbar("Failed to update qualification.", "snack-error");
        }
      });
    }
  }

  editQualificationsDetails(event : any) {
    console.log(event)
    this.sharedAccordionFunctionality.employeeQualificationForm.enable();
    this.sharedAccordionFunctionality.editQualifications = true;
    //this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualifications", false)
  }

  cancelQualificationsEdit(){
    this.sharedAccordionFunctionality.editQualifications = false;
    this.initializeForm();
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
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
}


