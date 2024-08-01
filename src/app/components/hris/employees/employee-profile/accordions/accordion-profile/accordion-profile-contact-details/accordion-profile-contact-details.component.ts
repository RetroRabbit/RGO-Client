import { Component, HostListener, Input } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';

@Component({
  selector: 'app-accordion-profile-contact-details',
  templateUrl: './accordion-profile-contact-details.component.html',
  styleUrls: ['./accordion-profile-contact-details.component.css']
})
export class AccordionProfileContactDetailsComponent {

  screenWidth = window.innerWidth;
  usingProfile: boolean = true;
  EmailRequired: boolean = false;
  isFocused: boolean = false;
  email: string = '';
  personalEmail: string = '';
  emergencyContactName: string = '';

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
    this.sharedAccordionFunctionality.employeeContactForm.get('houseNo')?.valueChanges.subscribe(value => {
      this.checkHouseNumberValue(value);
    });
    this.sharedAccordionFunctionality.employeeContactForm.get('emergencyContactNo')?.valueChanges.subscribe(value => {
      this.checkEmergencyNumberValue(value);
    });
    this.sharedAccordionFunctionality.employeeContactForm.get('cellphoneNo')?.valueChanges.subscribe(value => {
      this.checkCellphoneNumberValue(value);
    });
    this.email = this.sharedAccordionFunctionality.employeeContactForm.get('email')?.value;
    this.personalEmail = this.sharedAccordionFunctionality.employeeContactForm.get('personalEmail')?.value;
  }

  ngAfterViewInit(): void {
    const initialHouseNumberValue = this.sharedAccordionFunctionality.employeeContactForm.get('houseNo')?.value;
    this.checkHouseNumberValue(initialHouseNumberValue);
    const initialEmergencyNumberValue = this.sharedAccordionFunctionality.employeeContactForm.get('emergencyContactNo')?.value;
    this.checkEmergencyNumberValue(initialEmergencyNumberValue);
    const initialCellphoneNumberValue = this.sharedAccordionFunctionality.employeeContactForm.get('cellphoneNo')?.value;
    this.checkCellphoneNumberValue(initialCellphoneNumberValue);
  }

  isInputEmpty(emailToCheck: string): boolean {
    return emailToCheck === null || emailToCheck.trim() === '';
  }

  checkCellphoneNumberValue(value: string) {
    const cellphoneNumberContainer = document.querySelector('.cellphone-number-label');
    const cellphoneNumberValue = this.sharedAccordionFunctionality.employeeContactForm.get("cellphoneNo");

    if (value) {
      cellphoneNumberContainer?.classList.remove('shift-label');
    }
    else if (value === null && cellphoneNumberValue?.invalid) {
      cellphoneNumberContainer?.classList.add('shift-label');
    } else if (value === null && !cellphoneNumberValue?.invalid) {
      cellphoneNumberContainer?.classList.remove('shift-label');
    }
    else {
      cellphoneNumberContainer?.classList.add('shift-label');
    }

  }

  checkEmergencyNumberValue(value: string) {
    const emergencyNumberContainer = document.querySelector('.emergency-number-label');
    const emergencyNumberValue = this.sharedAccordionFunctionality.employeeContactForm.get("emergencyContactNo");

    if (value) {
      emergencyNumberContainer?.classList.remove('shift-label');
    }
    else if (value === null && emergencyNumberValue?.invalid) {
      emergencyNumberContainer?.classList.add('shift-label');
    } else if (value === null && !emergencyNumberValue?.invalid) {
      emergencyNumberContainer?.classList.remove('shift-label');
    }
    else {
      emergencyNumberContainer?.classList.add('shift-label');
    }
  }

  checkHouseNumberValue(value: string) {
    const houseNumberContainer = document.querySelector('.house-number-label');
    const houseNumberValue = this.sharedAccordionFunctionality.employeeContactForm.get("houseNo");

    if (value) {
      houseNumberContainer?.classList.remove('shift-label');
    }
    else if (value === null && !houseNumberValue?.invalid) {
      houseNumberContainer?.classList.add('shift-label');
    } else if (value === null && houseNumberValue?.invalid) {
      houseNumberContainer?.classList.remove('shift-label');
    }
    else {
      houseNumberContainer?.classList.add('shift-label');
    }
  }

  initializeForm() {
    this.sharedAccordionFunctionality.employeeContactForm = this.fb.group({
      email: [this.employeeProfile.employeeDetails.email, [Validators.required, Validators.pattern(this.sharedAccordionFunctionality.emailPattern)]],
      personalEmail: [this.employeeProfile.employeeDetails.personalEmail, [Validators.required, Validators.email, Validators.pattern("[^_\\W\\s@][\\w.!]*[\\w]*[@][\\w]*[.][\\w.]*")]],
      cellphoneNo: [this.employeeProfile.employeeDetails.cellphoneNo, [Validators.required]],
      houseNo: [this.employeeProfile.employeeDetails.houseNo],
      emergencyContactName: [this.employeeProfile.employeeDetails.emergencyContactName, [Validators.required, Validators.pattern(this.sharedAccordionFunctionality.namePattern)]],
      emergencyContactNo: [this.employeeProfile.employeeDetails.emergencyContactNo, [Validators.required]]


    });
    this.sharedAccordionFunctionality.employeeContactForm.disable();
    this.sharedAccordionFunctionality.checkContactFormProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeContactForm.controls), "Employee", true)
  }

  onFocus() {
    this.isFocused = true;
    //this.populated = true;
  }

  onBlur() {
    this.isFocused = false;
    //this.populated = false;
  }


  editContactDetails() {
    this.sharedAccordionFunctionality.employeeContactForm.enable();
    this.sharedAccordionFunctionality.editContact = true;
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeContactForm.controls), "Employee", false);
  }

  cancelContactEdit() {
    this.sharedAccordionFunctionality.editContact = false;
    this.initializeForm();
    this.sharedAccordionFunctionality.employeeContactForm.disable();
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
          this.snackBarService.showSnackbar("Updated", "snack-success");
          this.sharedAccordionFunctionality.checkContactFormProgress();
          this.sharedAccordionFunctionality.totalProfileProgress();
          this.sharedAccordionFunctionality.employeeContactForm.disable();
          this.sharedAccordionFunctionality.editContact = false;
        },
        error: (er) => this.snackBarService.showError(er),
      });
    }
    else {
      this.snackBarService.showSnackbar("Some Fields Are Still Missing Information", "snack-error");
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
