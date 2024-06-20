import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input-v16';

@Component({
  selector: 'app-accordion-profile-contact-details',
  templateUrl: './accordion-profile-contact-details.component.html',
  styleUrls: ['./accordion-profile-contact-details.component.css']
})
export class AccordionProfileContactDetailsComponent {

  fieldsToSubscribe: string[] = ['cellphoneNo', 'houseNo', 'emergencyContactNo'];
  @ViewChild('cellphoneField')
  cellphoneField!: NgxMatIntlTelInputComponent;

  screenWidth = window.innerWidth;
  usingProfile: boolean = true;
  inputStatus: { [key: string]: boolean } = {
    cellphoneNo: false,
    houseNo: false,
  };
  isCellphoneEmpty: boolean = true;
  isHouseNoEmpty: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }


  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) {
  }


  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeForm();
    // this.checkInputStatus();
    // this.sharedAccordionFunctionality.employeeContactForm.disable();
    // this.fieldsToSubscribe.forEach(field => {
    //   const value = this.sharedAccordionFunctionality.employeeContactForm.get(field)?.value;
    //   this.onInputCheck(field);
    // });
  }

  // checkInputStatus(): void {
  //   this.isCellphoneEmpty = !this.sharedAccordionFunctionality.employeeContactForm.get('cellphoneNo')?.value;
  //   this.isHouseNoEmpty = !this.sharedAccordionFunctionality.employeeContactForm.get('houseNo')?.value;
  // }

  // onInputChange(fieldName: string): void {
  //   console.log("current form control value:", this.sharedAccordionFunctionality.employeeContactForm.get('cellphoneNo')?.value);
  //   if (fieldName === 'cellphoneNo') {
  //     const cellphoneNoValid = this.sharedAccordionFunctionality.employeeContactForm.get('cellphoneNo')?.value;
  //     this.isCellphoneEmpty = !cellphoneNoValid && cellphoneNoValid;
  //   } else if (fieldName === 'houseNo') {
  //     this.isHouseNoEmpty = !this.sharedAccordionFunctionality.employeeContactForm.get('houseNo')?.value;
  //   }
  // }
  isLabelHover(formControl: AbstractControl): boolean {
    if (!formControl) {
      return false;
    }
  
    // Condition 1: value is undefined and control is untouched
    if (!formControl.value && !formControl.touched) {
      return false;
    }
  
    // Condition 2: value is defined and control is untouched
    if (formControl.value && !formControl.touched) {
      return true;
    }
  
    // Condition 3: value is undefined and control is touched
    if (!formControl.value && formControl.touched) {
      // Reset touched state to allow condition 1 to be reevaluated
      formControl.markAsUntouched();
      return true;
    }
  
    // Condition 4: value is defined and control is touched
    if (formControl.value && formControl.touched) {
      return true;
    }
  
    return true;
  }
  

  // isValidCellphone(): boolean {
  //   if()
  //   return (this.sharedAccordionFunctionality.employeeContactForm.controls['cellphoneNo'].hasError('required') && this.sharedAccordionFunctionality.employeeContactForm.controls['cellphoneNo'].value == '') || this.sharedAccordionFunctionality.employeeContactForm.controls['cellphoneNo'].value != '' && this.sharedAccordionFunctionality.employeeContactForm.controls['cellphoneNo'].invalid;
  // }
  //if the value is empty then return false :95px
  //if the input has a value and is invalid return false :0px
  //if the input has a value and is valid return true :0px

  // ngAfterViewInit() {
  //   this.checkInitialValue();
  //      this.fieldsToSubscribe.forEach(field => {
  //     this.onSubscribe(field);
  //  });
  // } 

  // checkInitialValue(field:string) {
  //   const value = this.sharedAccordionFunctionality.employeeContactForm.get('cellphoneNo')?.value;
  //   this.onInputCheck(value);
  //   const control = this.sharedAccordionFunctionality.employeeContactForm.get(field);
  //   const value = control?.value;
  //   console.log(`Initial value of ${field}:`, value);
  //   this.onInputCheck(field);
  // }

  // onSubscribe(field:string){
  //   this.sharedAccordionFunctionality.employeeContactForm.get('cellphoneNo')?.valueChanges.subscribe(value => {
  //     this.onInputCheck(value);
  //   });
  //   const control = this.sharedAccordionFunctionality.employeeContactForm.get(field);
  //   control?.valueChanges.subscribe(value => {
  //     this.onInputCheck(value);
  //     const checkError = this.sharedAccordionFunctionality.employeeContactForm.controls[field].invalid;
  //     if(checkError){
  //       this.onInputCheck("invalid value");
  //     } 
  //   });  
  // }

  // onInputCheck(value: string): void {
  //   const container = document.querySelector('.telephone-label');
  //   console.log('onInputCheck called with value:', value);
  //   if (value) {
  //     container?.classList.add('telephone-label-has-value');
  //   } else {
  //     container?.classList.remove('telephone-label-no-value');
  //   }
  // }

  initializeForm() {
    this.sharedAccordionFunctionality.employeeContactForm = this.fb.group({
      email: [this.employeeProfile.employeeDetails.email, [Validators.required, Validators.pattern(this.sharedAccordionFunctionality.emailPattern)]],
      personalEmail: [this.employeeProfile.employeeDetails.personalEmail, [Validators.required, Validators.email, Validators.pattern("[^_\\W\\s@][\\w.!]*[\\w]*[@][\\w]*[.][\\w.]*")]],
      cellphoneNo: [this.employeeProfile.employeeDetails.cellphoneNo, [Validators.required]],
      houseNo: [this.employeeProfile.employeeDetails.houseNo, [Validators.minLength(4)]],
      emergencyContactName: [this.employeeProfile.employeeDetails.emergencyContactName, [Validators.required, Validators.pattern(this.sharedAccordionFunctionality.namePattern)]],
      emergencyContactNo: [this.employeeProfile.employeeDetails.emergencyContactNo, [Validators.required]]
    });
    this.sharedAccordionFunctionality.employeeContactForm.disable();
    this.sharedAccordionFunctionality.checkContactFormProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeContactForm.controls), "Employee", true)
  }

  editContactDetails() {
    this.sharedAccordionFunctionality.employeeContactForm.enable();
    this.sharedAccordionFunctionality.editContact = true;
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeContactForm.controls), "Employee", false)
    // setTimeout(() => {
    //   this.fieldsToSubscribe.forEach(field => {
    //     this.checkInitialValue(field);
    //     this.onSubscribe(field);
    //   });
    // }, 0);
  }

  cancelContactEdit() {
    this.sharedAccordionFunctionality.editContact = false;
    this.initializeForm();
    this.sharedAccordionFunctionality.employeeContactForm.disable();
    // this.checkInputStatus();
  }

  saveContactDetails() {
    if (this.sharedAccordionFunctionality.employeeContactForm.valid) {
      const employeeContactFormValues = this.sharedAccordionFunctionality.employeeContactForm.value;
      this.employeeProfile.employeeDetails.personalEmail = employeeContactFormValues.personalEmail;
      this.employeeProfile.employeeDetails.email = employeeContactFormValues.email;
      this.employeeProfile.employeeDetails.cellphoneNo = employeeContactFormValues.cellphoneNo;
      this.employeeProfile.employeeDetails.emergencyContactName = employeeContactFormValues.emergencyContactName;
      this.employeeProfile.employeeDetails.emergencyContactNo = employeeContactFormValues.emergencyContactNo;
      this.employeeProfile.employeeDetails.houseNo = employeeContactFormValues.houseNo;

      this.employeeService.updateEmployee(this.employeeProfile.employeeDetails).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Contact details updated", "snack-success");
          this.sharedAccordionFunctionality.checkContactFormProgress();
          this.sharedAccordionFunctionality.totalProfileProgress();
          this.sharedAccordionFunctionality.employeeContactForm.disable();
          this.sharedAccordionFunctionality.editContact = false;
        },
        error: (error) => { this.snackBarService.showSnackbar(error.error, "snack-error") },
      });
    }
    else {
      this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
    }
  }

  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    if (!this.sharedPropertyAccessService.accessProperties) {
      return;
    }
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.sharedAccordionFunctionality.employeeContactForm.get(fieldName);

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
