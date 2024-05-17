import { Component, HostListener, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';
import { WorkExperience } from 'src/app/models/hris/work-experience.interface';
import { WorkExperienceService } from 'src/app/services/hris/employee/employee-work-experience.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';

@Component({
  selector: 'app-accordion-career-work-experience',
  templateUrl: './accordion-career-work-experience.component.html',
  styleUrls: ['./accordion-career-work-experience.component.css']
})
export class AccordionCareerWorkExperienceComponent {

  screenWidth = window.innerWidth;

  @HostListener('window:resize',['$event'])
  onResize(){
    this.screenWidth = window.innerWidth;
  }

  panelOpenState: boolean = false;
  @Input() WorkExperience!: { workExperience: WorkExperience }
  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  workExperienceFormProgress: number = 0;
  editWorkExperience: boolean = false;
  workExperienceData: any = [];
  workExperienceDto !: any;

  workExperienceForm: FormGroup = this.fb.group({
    title: { value: '', disabled: true },
    employementType: { value: '', disabled: true },
    companyName: { value: '', disabled: true },
    location: { value: '', disabled: true },
    startDate: { value: '', disabled: true },
    endDate: { value: '', disabled: true }
  });

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private workExperienceService: WorkExperienceService,
    private snackBarService: SnackbarService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) {
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.workExperienceForm = this.fb.group({
      title: [this.WorkExperience.workExperience.title, Validators.required],
      employementType: [this.WorkExperience.workExperience.employementType, Validators.required],
      companyName: [this.WorkExperience.workExperience.companyName, Validators.required],
      location: [this.WorkExperience.workExperience.location, Validators.required],
      startDate: [this.WorkExperience.workExperience.startDate, Validators.required],
      endDate: [this.WorkExperience.workExperience.endDate, Validators.required]
    });
    this.workExperienceForm.disable();
    this.checkWorkExperienceFormProgress();
    this.checkPropertyPermissions(Object.keys(this.workExperienceForm.controls), "Employee", true)
  }

  uploadDocument() {
    console.log("Upload Document");
  }

  addAnotherDocument() {
    console.log("Add another document");
  }

  editWorkExperiences() {
    this.workExperienceForm.enable();
    this.editWorkExperience = true;
    this.checkPropertyPermissions(Object.keys(this.workExperienceForm.controls), "Employee", false)
  }

  cancelWorkExperienceEdit() {
    this.editWorkExperience = false;
    this.initializeForm();
    this.workExperienceForm.disable();
  }

  getWorkExperience() {
    this.workExperienceService.getWorkExperience(this.employeeProfile.employeeDetails.id).subscribe({
      next: data => {
        this.workExperienceData = data;
      }
    });
  }

  saveWorkExperience() {
    // if (this.sharedAccordionFunctionality.workExperienceForm.valid) {
    //   const workExperienceFormValues = this.sharedAccordionFunctionality.workExperienceForm.value;

    //   this.sharedAccordionFunctionality.workExperienceDto.title = workExperienceFormValues.title;
    //   this.sharedAccordionFunctionality.workExperienceDto.employementType = workExperienceFormValues.employementType;
    //   this.sharedAccordionFunctionality.workExperienceDto.companyName = workExperienceFormValues.companyName;
    //   this.sharedAccordionFunctionality.workExperienceDto.location = workExperienceFormValues.location;
    //   this.sharedAccordionFunctionality.workExperienceDto.startDate = workExperienceFormValues.startDate;
    //   this.sharedAccordionFunctionality.workExperienceDto.endDate = workExperienceFormValues.endDate;
    //   this.sharedAccordionFunctionality.workExperienceDto.employeeId = this.employeeProfile.employeeDetails.id;

    //   console.log("DTO" + this.sharedAccordionFunctionality.workExperienceDto);
    //   console.log("FORM" + this.sharedAccordionFunctionality.workExperienceForm);

    //   this.workExperienceService.update(this.sharedAccordionFunctionality.workExperienceDto).subscribe({
    //     next: (data) => {
    //       this.snackBarService.showSnackbar("Contact details updated", "snack-success");
    //       this.sharedAccordionFunctionality.checkWorkExperienceFormProgress();
    //       this.sharedAccordionFunctionality.totalProfileProgress();
    //       this.sharedAccordionFunctionality.workExperienceForm.disable();
    //       this.sharedAccordionFunctionality.editContact = false;
    //     },
    //     error: (error) => { this.snackBarService.showSnackbar(error.error, "snack-error") },
    //   });
    // }
    // else {
    //   this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
    // }
    console.log("Saved");
  }

  checkWorkExperienceFormProgress() {
    let filledCount = 0;
    const formControls = this.workExperienceForm.controls;
    const totalFields = Object.keys(this.workExperienceForm.controls).length;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.workExperienceFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.workExperienceForm.get(fieldName);

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
