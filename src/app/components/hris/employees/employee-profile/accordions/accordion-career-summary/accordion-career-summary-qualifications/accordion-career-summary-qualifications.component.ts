import { Component, HostListener, Input } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeQualificationsService } from 'src/app/services/hris/employee/employee-qualifications.service';
import { EmployeeQualifications } from 'src/app/models/hris/employee-qualifications.interface';
import { DateRange } from '@angular/material/datepicker';

@Component({
  selector: 'app-career-summary-qualifications',
  templateUrl: './accordion-career-summary-qualifications.component.html',
  styleUrls: ['./accordion-career-summary-qualifications.component.css']
})

export class CareerSummaryQualificationsComponent {

  screenWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  usingProfile: boolean = true;
  qualifications : any = [1]
  employeeQualifications: EmployeeQualifications[] = [];
  qualificationForms: FormGroup[] = [];

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
    this.initializeForm();
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

  initializeForm() {
    this.employeeQualificationsService.getEmployeeQualificationsById(this.employeeProfile!.employeeDetails.id).subscribe({
      next: data => {
        this.employeeQualifications = data;
        console.log(this.employeeQualifications)
        // Update FormArray efficiently
        this.getQualifications.clear();
        this.employeeQualifications.forEach(qualification => {
          this.getQualifications.push(this.createQualificationForm(qualification));
        });
        console.log(this.getQualifications);
        this.sharedAccordionFunctionality.employeeQualificationForm.disable(); 
        //this.sharedAccordionFunctionality.totalProfileProgress();
        //this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualifications", true);
        },
        //this.qualificationForms.push(this.initializeEmptyForm()
      error: (error) => {
        this.snackBarService.showSnackbar("Error fetching qualifications", "snack-error");
        console.error(error); 
      }
    });
  }

  createQualificationForm(qualification: EmployeeQualifications = {} as EmployeeQualifications): FormGroup {
    return this.fb.group({
      id: qualification.id || 0,  // 0 for new qualifications
      highestQualification: [qualification.highestQualification, Validators.required],
      school: [qualification.school, Validators.required],
      degree: [qualification.degree, [Validators.required]],
      fieldOfStudy: [qualification.fieldOfStudy, [Validators.required]],
      year: [qualification.year, [Validators.pattern(/^(19|20)\d{2}$/), Validators.required]],
      nqfLevel: [qualification.nqfLevel, [Validators.required]]
    });
  }


  get getQualifications() {
    return this.sharedAccordionFunctionality.employeeQualificationForm.controls["qualifications"] as FormArray;
  }

  addQualificationToForm() {
    this.getQualifications.push(this.createQualificationForm());
  }

  removeQualificationfromForm(index:number) {
    this.getQualifications.removeAt(index);
  }

  saveQualificationsEdit(qualification: any){
    console.log("hitting save or update");
    var qualificationDto: EmployeeQualifications = {
      id : qualification.id,
      employeeId: this.employeeProfile.employeeDetails.id,
      highestQualification: qualification.highestQualification,
      school: qualification.school,
      degree: qualification.degree,
      fieldOfStudy: qualification.fieldOfStudy,
      year: qualification.year,
      nqfLevel: qualification.nqfLevel,
    };

    if(qualificationDto.id == 0){
      console.log("hitting save id 0");
      var newQualificationDto: EmployeeQualifications = {
        id : 0,
        employeeId: this.employeeProfile.employeeDetails.id,
        highestQualification: this.employeeProfile!.employeeDetails.qualifications?.highestQualification,
        school: this.employeeProfile!.employeeDetails.qualifications?.school,
        degree: this.employeeProfile!.employeeDetails.qualifications?.degree,
        fieldOfStudy: this.employeeProfile!.employeeDetails.qualifications?.fieldOfStudy,
        year: this.employeeProfile!.employeeDetails.qualifications?.year,
        nqfLevel: this.employeeProfile!.employeeDetails.qualifications?.nqfLevel,
      };

      console.log(newQualificationDto);
      this.employeeQualificationsService.saveEmployeeQualification(newQualificationDto).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Document added", "snack-success");
          //this.getAdditionalDocuments();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      });
    }
  }

  cancelQualificationsEdit(){
    this.sharedAccordionFunctionality.editQualifications = false;
    this.initializeForm();
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
  }

  addQualification(){
    this.qualifications.push(1)
  }

  removeQualification(){
    this.qualifications.splice(0, 1);
  }
}


