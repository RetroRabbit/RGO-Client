import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Client } from 'src/app/models/hris/client.interface';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { levels } from 'src/app/models/hris/constants/levels.constants';
import { races } from 'src/app/models/hris/constants/races.constants';
import { genders } from 'src/app/models/hris/constants/genders.constants';
import { countries } from 'src/app/models/hris/constants/countries.constants';
import { disabilities } from 'src/app/models/hris/constants/disabilities.constant';
import { provinces } from 'src/app/models/hris/constants/provinces.constants';
import { CustomvalidationService } from 'src/app/services/hris/idnumber-validator';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { ClientService } from 'src/app/services/hris/client.service';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { FieldCodeService } from 'src/app/services/hris/field-code.service';
import { FieldCode } from 'src/app/models/hris/field-code.interface';
import { category } from 'src/app/models/hris/constants/fieldcodeCategory.constants';
import { EmployeeAddressService } from 'src/app/services/hris/employee/employee-address.service';
import { dataTypes } from 'src/app/models/hris/constants/types.constants';
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  @Output() updateProfile = new EventEmitter<number>();
  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  contactFormProgress: number = 0;
  usingProfile: boolean = true;

  employeeContactForm: FormGroup = this.fb.group({
    email: { value: '', disabled: true },
    personalEmail: { value: '', disabled: true },
    cellphoneNo: { value: '', disabled: true },
    houseNo: { value: '', disabled: true },
    emergencyContactName: { value: '', disabled: true },
    emergencyContactNo: { value: '', disabled: true }
  });


  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    private customValidationService: CustomvalidationService,
    private employeeProfileService: EmployeeProfileService,
    private employeeDataService: EmployeeDataService,
    private clientService: ClientService,
    private employeeTypeService: EmployeeTypeService,
    private fieldCodeService: FieldCodeService,
    private employeeAddressService: EmployeeAddressService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) {

  }
  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeForm();
    // this.initializeEmployeeProfileDto();
    // this.getEmployeeFields();
    // this.getClients();
    // this.checkEmployeeDetails();
  }
  initializeForm() {


    this.employeeContactForm = this.fb.group({
      email: [this.employeeProfile!.employeeDetails.email, [Validators.required, Validators.pattern(this.sharedAccordionFunctionality.emailPattern)]],
      personalEmail: [this.employeeProfile!.employeeDetails.personalEmail, [Validators.required, Validators.email, Validators.pattern("[^_\\W\\s@][\\w.!]*[\\w]*[@][\\w]*[.][\\w.]*")]],
      cellphoneNo: [this.employeeProfile!.employeeDetails.cellphoneNo, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      houseNo: [this.employeeProfile!.employeeDetails.houseNo, [Validators.required, Validators.minLength(4), Validators.pattern(/^[0-9]*$/)]],
      emergencyContactName: [this.employeeProfile!.employeeDetails.emergencyContactName, [Validators.required, Validators.pattern(this.sharedAccordionFunctionality.namePattern)]],
      emergencyContactNo: [this.employeeProfile!.employeeDetails.emergencyContactNo, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(10)]]
    });
    this.employeeContactForm.disable();
    this.checkContactFormProgress();
    this.checkPropertyPermissions(Object.keys(this.employeeContactForm.controls), "Employee", true)


  }

  editContactDetails() {
    this.employeeContactForm.enable();
    this.sharedAccordionFunctionality.editContact = true;
    this.checkPropertyPermissions(Object.keys(this.employeeContactForm.controls), "Employee", false)
  }

  cancelContactEdit() {
    this.sharedAccordionFunctionality.editContact = false;
    this.initializeForm();
    this.employeeContactForm.disable();
  }

  saveContactEdit() {
    if (this.employeeContactForm.valid) {
      const employeeContactFormValues = this.employeeContactForm.value;

      this.sharedAccordionFunctionality.employeeProfileDto.personalEmail = employeeContactFormValues.personalEmail;
      this.sharedAccordionFunctionality.employeeProfileDto.email = employeeContactFormValues.email;
      this.sharedAccordionFunctionality.employeeProfileDto.cellphoneNo = employeeContactFormValues.cellphoneNo;
      this.sharedAccordionFunctionality.employeeProfileDto.emergencyContactName = employeeContactFormValues.emergencyContactName;
      this.sharedAccordionFunctionality.employeeProfileDto.emergencyContactNo = employeeContactFormValues.emergencyContactNo;
      this.sharedAccordionFunctionality.employeeProfileDto.houseNo = employeeContactFormValues.houseNo;

      this.employeeService.updateEmployee(this.sharedAccordionFunctionality.employeeProfileDto).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Contact details updated", "snack-success");
          this.checkContactFormProgress();
          // this.totalProfileProgress();
          this.employeeContactForm.disable();
          this.sharedAccordionFunctionality.editContact = false;
        },
        error: (error) => { this.snackBarService.showSnackbar(error.error, "snack-error") },
      });
    }
    else {
      this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
    }
  }
  checkContactFormProgress() {
    let filledCount = 0;
    const formControls = this.employeeContactForm.controls;
    const totalFields = Object.keys(this.employeeContactForm.controls).length;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.contactFormProgress = Math.round((filledCount / totalFields) * 100);
  }
  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.employeeContactForm.get(fieldName);

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
