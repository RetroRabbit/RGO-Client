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
  @Input() employeeProfile !: EmployeeProfile | SimpleEmployee

  workExperienceFormProgress: number = 0;
  editWorkExperience: boolean = false;
  workExperienceDto !: any;
  workExperience: WorkExperience[] = [];
  workExperienceData: any = [];
  hasWorkExperienceData: boolean = false;
  workExperienceId: number = 0;
  isUpdated: boolean = false;
  hasUpdatedWorkExperience: boolean = false;

  workExperienceForm: FormGroup = this.fb.group({
    title: { value: '', disabled: true },
    employementType: { value: '', disabled: true },
    companyName: { value: '', disabled: true },
    location: { value: '', disabled: true },
    startDate: { value: '', disabled: true },
    endDate: { value: '', disabled: true },
    employeeId: { value: '', disabled: true }
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

  ngOnInit(): void {
    this.getWorkExperience();
    console.log(this.workExperienceData);
  }

  initializeForm(workExperienceDetails: WorkExperience) {

    if(workExperienceDetails == null) {
      this.hasWorkExperienceData = false;
      return;
    }
    this.workExperienceForm = this.fb.group({
      title: [{ value: workExperienceDetails.title, disabled: true }, Validators.required],
      employementType: [{ value: workExperienceDetails.employementType, disabled: true }, Validators.required],
      companyName: [{ value: workExperienceDetails.companyName, disabled: true }, Validators.required],
      location: [{ value: workExperienceDetails.location, disabled: true }, Validators.required],
      startDate: [{ value: workExperienceDetails.startDate, disabled: true }, Validators.required],
      endDate: [{ value: workExperienceDetails.endDate, disabled: true }, Validators.required],
      employeeId: [{ value: workExperienceDetails.employeeId, disabled: true }, Validators.required]
    });
    this.workExperienceForm.disable();
    this.hasWorkExperienceData = true;
    this.checkWorkExperienceFormProgress();
  }
  
  getWorkExperience() {
    this.workExperienceService.getWorkExperience(this.employeeProfile.id).subscribe({
      next: (data) => {
        this.workExperienceData = data;
        if (this.workExperience != null) {
          this.workExperienceId = this.workExperience[this.workExperience.length - 1].id;
        }
        this.initializeForm(this.workExperience[this.workExperience.length - 1]);
      }
    })
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  addWorkExperience() {
    console.log("Add another document");
  }

  editWorkExperiences() {
    this.editWorkExperience = true;
    this.workExperienceForm.enable();
  }

  cancelWorkExperienceEdit() {
    this.editWorkExperience = false;
    this.workExperienceForm.disable();
  }

  saveWorkExperience() {
    this.editWorkExperience = false;
    this.isUpdated = true;
    const workExperienceFormValue = this.workExperienceForm.value;

    const startDate = this.formatDate(this.workExperienceForm.value.startDate);
    const endDate = this.formatDate(this.workExperienceForm.value.endDate);

    this.workExperienceDto = {
      id: this.workExperienceId,
      title: workExperienceFormValue.title,
      employementType: workExperienceFormValue.employementType,
      companyName: workExperienceFormValue.companyName,
      location: workExperienceFormValue.location,
      startDate: startDate,
      endDate: endDate,     
      employeeId: this.employeeProfile?.id
    };

    if (this.hasWorkExperienceData) {
      this.workExperienceService.update(this.workExperienceDto).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Work experience details updated", "snack-success");
          this.getWorkExperience();
          this.checkWorkExperienceFormProgress();
          this.hasUpdatedWorkExperience = true;
          this.editWorkExperience = false;
          this.workExperienceForm.disable();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      })
    }
    else {
      this.workExperienceService.save(this.workExperienceDto).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Work experience details added", "snack-success");
          this.getWorkExperience();
          this.checkWorkExperienceFormProgress();
          this.hasUpdatedWorkExperience = true;
          this.editWorkExperience = false;
          this.workExperienceForm.disable();
        }
        , error: (error) => {
          this.snackBarService.showSnackbar("Failed to create Work experience details", "snack-error");
        }
      })
    }
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
}
