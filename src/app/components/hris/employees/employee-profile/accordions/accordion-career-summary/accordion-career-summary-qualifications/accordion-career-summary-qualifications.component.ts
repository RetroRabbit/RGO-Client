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
import { nqfLevels } from 'src/app/models/hris/constants/nqfLevels.constant.';

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
    this.fetchQualificationsById();
  }

  ngAfterViewInit(){
    this.fetchQualificationsById();
  }

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  initializeForm() {
    this.sharedAccordionFunctionality.employeeQualificationForm = this.fb.group({
      highestQualification: [this.sharedAccordionFunctionality.employeeQualificationDto.highestQualification, Validators.required],
      school: [this.sharedAccordionFunctionality.employeeQualificationDto.school, Validators.required],
      fieldOfStudy: [this.sharedAccordionFunctionality.employeeQualificationDto.fieldOfStudy, Validators.required],
      year: [this.sharedAccordionFunctionality.employeeQualificationDto.year, Validators.required],
      nqfLevel: [this.sharedAccordionFunctionality.employeeQualificationDto.nqfLevel, Validators.required],
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

  fetchQualificationsById() {
    var employeeId = this.navservice.employeeProfile.id!;
    this.employeeQualificationsService.getEmployeeQualificationById(employeeId).subscribe({
      next: (data) => {
        this.sharedAccordionFunctionality.employeeQualificationDto.id = data.id;
        this.sharedAccordionFunctionality.employeeQualificationDto.employeeId = data.employeeId;
        this.sharedAccordionFunctionality.employeeQualificationDto.highestQualification = data.highestQualification;
        this.sharedAccordionFunctionality.employeeQualificationDto.school = data.school;
        this.sharedAccordionFunctionality.employeeQualificationDto.fieldOfStudy = data.fieldOfStudy;
        this.sharedAccordionFunctionality.employeeQualificationDto.year = data.year;
        this.sharedAccordionFunctionality.employeeQualificationDto.nqfLevel = data.nqfLevel;
        console.log(this.sharedAccordionFunctionality.employeeQualificationDto);
      },
      error: (error) => {
        this.snackBarService.showSnackbar(error.error, "snack-error");
      }
    })
    this.initializeForm();
  }

  saveQualificationsEdit() {
    if (this.sharedAccordionFunctionality.employeeQualificationForm.valid) {
      const existingQualificationId = this.sharedAccordionFunctionality.employeeQualificationDto.id;
  
      const updatedQualification: EmployeeQualifications = {
        id: existingQualificationId || 0,
        employeeId: this.navservice.employeeProfile.id || this.employeeProfile.employeeDetails.id,
        highestQualification: this.sharedAccordionFunctionality.employeeQualificationForm.get("highestQualification")?.value,
        school: this.sharedAccordionFunctionality.employeeQualificationForm.get("school")?.value,
        fieldOfStudy: this.sharedAccordionFunctionality.employeeQualificationForm.get("fieldOfStudy")?.value,
        year: this.sharedAccordionFunctionality.employeeQualificationForm.get("year")?.value,
        nqfLevel: this.sharedAccordionFunctionality.employeeQualificationForm.get("nqfLevel")?.value,
      };
  
      const qualificationObservable = existingQualificationId
        ? this.employeeQualificationsService.updateEmployeeQualification(updatedQualification, existingQualificationId)
        : this.employeeQualificationsService.saveEmployeeQualification(updatedQualification);
  
      qualificationObservable.subscribe({
        next: (data) => {
          //this.fetchQualificationsById();  
          this.snackBarService.showSnackbar(
            existingQualificationId ? "Qualifications updated" : "Qualifications saved",
            "snack-success"
          );
          this.fetchQualificationsById();
          this.sharedAccordionFunctionality.editQualifications = false;
          this.sharedAccordionFunctionality.employeeQualificationForm.disable();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error.error, "snack-error");
        },
      });
    } else {
      this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
    }
  }

  cancelQualificationsEdit(){
    this.fetchQualificationsById();
    this.sharedAccordionFunctionality.editQualifications = false;
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