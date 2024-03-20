import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { ClientService } from 'src/app/services/hris/client.service';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { FieldCodeService } from 'src/app/services/hris/field-code.service';
import { CustomvalidationService } from 'src/app/services/hris/idnumber-validator';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';

@Component({
  selector: 'app-accordion-profile-personal-details',
  templateUrl: './accordion-profile-personal-details.component.html',
  styleUrls: ['./accordion-profile-personal-details.component.css']
})
export class AccordionProfilePersonalDetailsComponent {

  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  @Output() updateProfile = new EventEmitter<number>();
  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  personalFormProgress: number = 0;
  employeeFormProgress: number = 0;
  addressFormProgress: number = 0;
  contactFormProgress: number = 0;

  usingProfile: boolean = true;

  initializeForm() {
    this.sharedAccordionFunctionality.employeeDetailsForm = this.fb.group({
      name: [this.employeeProfile!.employeeDetails.name, [Validators.required,
      Validators.pattern(this.sharedAccordionFunctionality.namePattern)]],
      surname: [this.employeeProfile!.employeeDetails.surname, [Validators.required,
      Validators.pattern(this.sharedAccordionFunctionality.namePattern)]],
      initials: [this.employeeProfile!.employeeDetails.initials, [Validators.pattern(this.sharedAccordionFunctionality.initialsPattern)]],
      clientAllocated: this.employeeProfile!.employeeDetails.clientAllocated,
      employeeType: this.employeeProfile!.employeeDetails.employeeType!.name,
      level: this.employeeProfile!.employeeDetails.level,
      teamLead: this.usingProfile ? this.employeeProfile!.employeeDetails.teamLead : this.employeeProfile!.simpleEmployee.teamLeadId,
      dateOfBirth: [this.employeeProfile!.employeeDetails.dateOfBirth, Validators.required],
      idNumber: [this.employeeProfile!.employeeDetails.idNumber, [Validators.required, this.customValidationService.idNumberValidator]],
      engagementDate: [this.employeeProfile!.employeeDetails.engagementDate, Validators.required],
      peopleChampion: this.usingProfile ? this.employeeProfile!.employeeDetails.peopleChampion : this.employeeProfile!.simpleEmployee.peopleChampionId
    });
    this.sharedAccordionFunctionality.employeeDetailsForm.disable();
    this.checkEmployeeFormProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeDetailsForm.controls), "Employee", "employeeDetailsForm", true)


    this.sharedAccordionFunctionality.employeeContactForm = this.fb.group({
      email: [this.employeeProfile!.employeeDetails.email, [Validators.required, Validators.pattern(this.sharedAccordionFunctionality.emailPattern)]],
      personalEmail: [this.employeeProfile!.employeeDetails.personalEmail, [Validators.required, Validators.email, Validators.pattern("[^_\\W\\s@][\\w.!]*[\\w]*[@][\\w]*[.][\\w.]*")]],
      cellphoneNo: [this.employeeProfile!.employeeDetails.cellphoneNo, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      houseNo: [this.employeeProfile!.employeeDetails.houseNo, [Validators.required, Validators.minLength(4), Validators.pattern(/^[0-9]*$/)]],
      emergencyContactName: [this.employeeProfile!.employeeDetails.emergencyContactName, [Validators.required, Validators.pattern(this.sharedAccordionFunctionality.namePattern)]],
      emergencyContactNo: [this.employeeProfile!.employeeDetails.emergencyContactNo, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(10)]]
    });
    this.sharedAccordionFunctionality.employeeContactForm.disable();
    this.checkContactFormProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeContactForm.controls), "Employee", "employeeContactForm", true)


    this.sharedAccordionFunctionality.addressDetailsForm = this.fb.group({
      physicalUnitNumber: [this.employeeProfile!.employeeDetails.physicalAddress?.unitNumber?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      physicalComplexName: [this.employeeProfile!.employeeDetails.physicalAddress?.complexName?.trim(), Validators.required],
      physicalStreetNumber: [this.employeeProfile!.employeeDetails.physicalAddress?.streetNumber?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      physicalSuburb: [this.employeeProfile!.employeeDetails.physicalAddress?.suburbOrDistrict?.trim(), Validators.required],
      physicalCity: [this.employeeProfile!.employeeDetails.physicalAddress?.city?.trim(), Validators.required],
      physicalCountry: [this.employeeProfile!.employeeDetails.physicalAddress?.country?.trim(), Validators.required],
      physicalProvince: [this.employeeProfile!.employeeDetails.physicalAddress?.province?.trim(), Validators.required],
      physicalPostalCode: [this.employeeProfile!.employeeDetails.physicalAddress?.postalCode?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(4), Validators.minLength(4)]],
      postalUnitNumber: [this.employeeProfile!.employeeDetails.postalAddress?.unitNumber?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      postalComplexName: [this.employeeProfile!.employeeDetails.postalAddress?.complexName?.trim(), Validators.required],
      postalStreetNumber: [this.employeeProfile!.employeeDetails.postalAddress?.streetNumber?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      postalSuburb: [this.employeeProfile!.employeeDetails.postalAddress?.suburbOrDistrict?.trim(), Validators.required],
      postalCity: [this.employeeProfile!.employeeDetails.postalAddress?.city?.trim(), Validators.required],
      postalCountry: [this.employeeProfile!.employeeDetails.postalAddress?.country?.trim(), Validators.required],
      postalProvince: [this.employeeProfile!.employeeDetails.postalAddress?.province?.trim(), Validators.required],
      postalPostalCode: [this.employeeProfile!.employeeDetails.postalAddress?.postalCode?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(4), Validators.minLength(4)]]
    });
    this.sharedAccordionFunctionality.addressDetailsForm.disable();
    this.checkAddressFormProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls), "EmployeeAddress", "addressDetailsForm", true)


    this.sharedAccordionFunctionality.personalDetailsForm = this.fb.group({
      gender: [this.employeeProfile!.employeeDetails.gender, Validators.required],
      race: [this.employeeProfile!.employeeDetails.race, Validators.required],
      disability: [this.employeeProfile!.employeeDetails.disability, Validators.required],
      disabilityList: "",
      disabilityNotes: [this.employeeProfile!.employeeDetails.disabilityNotes]
    });

    this.sharedAccordionFunctionality.personalDetailsForm.disable();
    this.checkPersonalFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();
    this.checkEmployeeDetails();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.personalDetailsForm.controls), "Employee", "personalDetailsForm", true)
  }

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
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) {
  }

  checkEmployeeDetails() {

    if (this.usingProfile)
      this.checkEmployeeDetailsUsingEmployeeProfile()
    else
      this.checkEmployeeDetailsNotUsingEmployeeProfile()
  }

  checkEmployeeDetailsUsingEmployeeProfile() {
    this.sharedAccordionFunctionality.foundTeamLead = this.sharedAccordionFunctionality.employees.find((data: any) => {
      return data.id == this.employeeProfile!.employeeDetails.teamLead
    });
    this.sharedAccordionFunctionality.foundClient = this.sharedAccordionFunctionality.clients.find((data: any) => {
      return data.id == this.employeeProfile!.employeeDetails.clientAllocated
    });
    this.sharedAccordionFunctionality.foundChampion = this.sharedAccordionFunctionality.employees.find((data: any) => {
      if (this.employeeProfile?.employeeDetails.peopleChampion != null) {
        return data.id == this.employeeProfile!.employeeDetails.peopleChampion
      }
      else return null;
    });

    if (this.sharedAccordionFunctionality.foundTeamLead != null) {
      this.sharedAccordionFunctionality.employeeDetailsForm.get('teamLead')?.setValue(this.sharedAccordionFunctionality.foundTeamLead.name + ' ' + this.sharedAccordionFunctionality.foundTeamLead.surname);
      this.employeeProfile.employeeDetails.id = this.sharedAccordionFunctionality.foundTeamLead.id
    }

    if (this.sharedAccordionFunctionality.foundClient != null) {
      this.sharedAccordionFunctionality.employeeDetailsForm.get('clientAllocated')?.setValue(this.sharedAccordionFunctionality.foundClient.name);
      this.sharedAccordionFunctionality.clientId = this.sharedAccordionFunctionality.foundClient.id
    }

    if (this.sharedAccordionFunctionality.foundChampion != null) {
      this.sharedAccordionFunctionality.employeeDetailsForm.get('peopleChampion')?.setValue(this.sharedAccordionFunctionality.foundChampion.name + ' ' + this.sharedAccordionFunctionality.foundChampion.surname);
      this.sharedAccordionFunctionality.peopleChampionId = this.sharedAccordionFunctionality.foundChampion.id
    }
  }

  checkEmployeeDetailsNotUsingEmployeeProfile() {
    if (this.employeeProfile.simpleEmployee.teamLeadId !== null) {
      this.sharedAccordionFunctionality.foundTeamLead = this.employeeProfile.simpleEmployee.teamLeadId;
      this.sharedAccordionFunctionality.employeeDetailsForm.get('teamLead')?.setValue(this.employeeProfile.simpleEmployee.teamLeadName);
    }
    if (this.employeeProfile.simpleEmployee.peopleChampionId !== null) {
      this.sharedAccordionFunctionality.employeeDetailsForm.get('peopleChampion')?.setValue(this.employeeProfile.simpleEmployee.peopleChampionName);
      this.sharedAccordionFunctionality.peopleChampionId = this.employeeProfile.simpleEmployee.peopleChampionId as number;
    }
    if (this.employeeProfile.simpleEmployee.clientAllocatedId !== null) {
      this.sharedAccordionFunctionality.employeeDetailsForm.get('clientAllocated')?.setValue(this.employeeProfile.simpleEmployee.clientAllocatedName);
      this.sharedAccordionFunctionality.clientId = this.employeeProfile.simpleEmployee.clientAllocatedId as number;
    }
  }

  editPersonalDetails() {
    this.sharedAccordionFunctionality.editPersonal = true;
    this.sharedAccordionFunctionality.personalDetailsForm.enable();
  }

  setHasDisability(event: any) {
    this.sharedAccordionFunctionality.hasDisability = event.value;
  }

  savePersonalEdit() {
    if (this.sharedAccordionFunctionality.personalDetailsForm.valid) {
      const personalDetailsFormValue = this.sharedAccordionFunctionality.personalDetailsForm.value;
      this.sharedAccordionFunctionality.employeeProfileDto.disability = personalDetailsFormValue.disability;
      this.sharedAccordionFunctionality.employeeProfileDto.disabilityNotes = personalDetailsFormValue.disabilityNotes;
      this.sharedAccordionFunctionality.employeeProfileDto.race = personalDetailsFormValue.race;
      this.sharedAccordionFunctionality.employeeProfileDto.gender = personalDetailsFormValue.gender;
      this.employeeService.updateEmployee(this.sharedAccordionFunctionality.employeeProfileDto).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Personal details updated", "snack-success");
          this.checkPersonalFormProgress();
          this.sharedAccordionFunctionality.totalProfileProgress();
          this.sharedAccordionFunctionality.personalDetailsForm.disable();
          this.sharedAccordionFunctionality.editPersonal = false;
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

  checkPersonalFormProgress() {
    let filledCount = 0;
    let totalFields = 0;
    const formControls = this.sharedAccordionFunctionality.personalDetailsForm.controls;

    if (this.sharedAccordionFunctionality.hasDisability) {
      totalFields = (Object.keys(this.sharedAccordionFunctionality.personalDetailsForm.controls).length);
    }
    else {
      totalFields = (Object.keys(this.sharedAccordionFunctionality.personalDetailsForm.controls).length) - 2;
    }
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '' && this.sharedAccordionFunctionality.hasDisability != false && control.value != "na") {
          filledCount++;
        }
        else if (controlName.includes("disability") && this.sharedAccordionFunctionality.hasDisability == false) {
          filledCount++;
        }
      }
    }
    this.personalFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  checkAddressFormProgress() {
    let filledCount = 0;
    const formControls = this.sharedAccordionFunctionality.addressDetailsForm.controls;
    let totalFields = 0;
    if (this.sharedAccordionFunctionality.physicalEqualPostal) {
      totalFields = (Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls).length) / 2;
    }
    else if (!this.sharedAccordionFunctionality.physicalEqualPostal) {
      totalFields = (Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls).length);
    }

    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (this.sharedAccordionFunctionality.physicalEqualPostal && controlName.includes("physical") && control.value != null && control.value != " " && control.value != "") {
          filledCount++;
        }
        else if (!this.sharedAccordionFunctionality.physicalEqualPostal && control.value != null && control.value != " " && control.value != "") {
          filledCount++;
        }
      }
    }
    this.addressFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  cancelPersonalEdit() {
    this.sharedAccordionFunctionality.editPersonal = false;
    this.sharedAccordionFunctionality.hasDisability = false;
    this.initializeForm();
    this.sharedAccordionFunctionality.personalDetailsForm.disable();
  }

  checkEmployeeFormProgress() {
    let filledCount = 0;
    const formControls = this.sharedAccordionFunctionality.employeeDetailsForm.controls;
    const totalFields = Object.keys(this.sharedAccordionFunctionality.employeeDetailsForm.controls).length;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.employeeFormProgress = Math.round((filledCount / totalFields) * 100);
    this.updateProfile.emit(this.employeeFormProgress);
  }

  checkContactFormProgress() {
    let filledCount = 0;
    const formControls = this.sharedAccordionFunctionality.employeeContactForm.controls;
    const totalFields = Object.keys(this.sharedAccordionFunctionality.employeeContactForm.controls).length;
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

  checkPropertyPermissions(fieldNames: string[], table: string, form: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;

      switch (form) {
        case "employeeDetailsForm":
          control = this.sharedAccordionFunctionality.employeeDetailsForm.get(fieldName);
          break;
        case "employeeContactForm":
          control = this.sharedAccordionFunctionality.employeeContactForm.get(fieldName);
          break;
        case "addressDetailsForm":
          control = this.sharedAccordionFunctionality.addressDetailsForm.get(fieldName);
          break;
        case "additionalInfoForm":
          control = this.sharedAccordionFunctionality.additionalInfoForm.get(fieldName);
          break;
      }

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
