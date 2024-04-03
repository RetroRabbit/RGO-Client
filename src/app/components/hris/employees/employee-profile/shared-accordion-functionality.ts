import { EventEmitter, Injectable, Input, Output } from '@angular/core';
import { Client } from 'src/app/models/hris/client.interface';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';
import { levels } from 'src/app/models/hris/constants/levels.constants';
import { races } from 'src/app/models/hris/constants/races.constants';
import { genders } from 'src/app/models/hris/constants/genders.constants';
import { countries } from 'src/app/models/hris/constants/countries.constants';
import { disabilities } from 'src/app/models/hris/constants/disabilities.constant';
import { provinces } from 'src/app/models/hris/constants/provinces.constants';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { category } from 'src/app/models/hris/constants/fieldcodeCategory.constants';
import { dataTypes } from 'src/app/models/hris/constants/types.constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';

@Injectable({
  providedIn: 'root'
})

export class SharedAccordionFunctionality {
  @Output() updateProfile = new EventEmitter<any>();

  employees: EmployeeProfile[] = [];
  clients: Client[] = [];
  employeeTypes: EmployeeType[] = [];
  filteredClients: Client[] = [];
  filteredEmployees: any = [];
  filteredPeopleChamps: any = [];
  employeeData: EmployeeData[] = [];
  customFields: CustomField[] = [];

  foundClient: EmployeeProfile | undefined;
  foundTeamLead: any;
  foundChampion: EmployeeProfile | undefined;
  employeeProfileDto?: any;
  clientId: number | undefined;
  peopleChampionId: number | undefined;

  panelOpenState: boolean = false;
  physicalEqualPostal: boolean = false;
  hasDisability: boolean | undefined = false;
  editEmployee: boolean = false;
  editPersonal: boolean = false;
  editAddress: boolean = false;
  editAdditional: boolean = false;
  editContact: boolean = false;

  employeeType?: EmployeeType;
  employeeClient!: EmployeeProfile;
  employeeTeamLead!: EmployeeProfile;
  employeePeopleChampion!: EmployeeProfile;
  selectedEmployee!: EmployeeProfile;
  employeePhysicalAddress !: EmployeeAddress;
  employeePostalAddress !: EmployeeAddress;

  employeeFormProgress: number = 0;
  profileFormProgress: number = 0;
  personalFormProgress: number = 0;
  contactFormProgress: number = 0;
  addressFormProgress: number = 0;
  additionalFormProgress: number = 0;

  genders = genders;
  races = races;
  levels = levels;
  countries = countries;
  disabilities = disabilities;
  provinces = provinces;
  category = category;
  fieldTypes = dataTypes;

  filteredCountries: any[] = this.countries.slice();
  usingProfile: boolean = true;

  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  initialsPattern = /^[A-Z]+$/;
  namePattern = /^[a-zA-Z\s'-]*$/

  constructor(
    private fb: FormBuilder,
    public sharedPropertyAccessService: SharedPropertyAccessService) { }

  personalDetailsForm: FormGroup = this.fb.group({
    gender: { value: '', disabled: true },
    race: { value: '', disabled: true },
    disability: { value: '', disabled: true },
    disabilityNotes: { value: '', disabled: true },
    disabilityList: { value: '', disabled: true }
  });

  employeeContactForm: FormGroup = this.fb.group({
    email: { value: '', disabled: true },
    personalEmail: { value: '', disabled: true },
    cellphoneNo: { value: '', disabled: true },
    houseNo: { value: '', disabled: true },
    emergencyContactName: { value: '', disabled: true },
    emergencyContactNo: { value: '', disabled: true }
  });

  employeeDetailsForm: FormGroup = this.fb.group({
    name: { value: '', disabled: true },
    surname: { value: '', disabled: true },
    initials: { value: '', disabled: true },
    clientAllocated: { value: '', disabled: true },
    employeeType: { value: '', disabled: true },
    level: { value: '', disabled: true },
    teamLead: { value: '', disabled: true },
    dateOfBirth: { value: '', disabled: true },
    idNumber: { value: '', disabled: true },
    engagementDate: { value: '', disabled: true },
    peopleChampion: { value: '', disabled: true }
  });

  addressDetailsForm: FormGroup = this.fb.group({
    physicalUnitNumber: { value: '', disabled: true },
    physicalComplexName: { value: '', disabled: true },
    physicalStreetNumber: { value: '', disabled: true },
    physicalSuburb: { value: '', disabled: true },
    physicalCity: { value: '', disabled: true },
    physicalCountry: { value: '', disabled: true },
    physicalProvince: { value: '', disabled: true },
    physicalPostalCode: { value: '', disabled: true },
    postalUnitNumber: { value: '', disabled: true },
    postalComplexName: { value: '', disabled: true },
    postalStreetNumber: { value: '', disabled: true },
    postalSuburb: { value: '', disabled: true },
    postalCity: { value: '', disabled: true },
    postalCountry: { value: '', disabled: true },
    postalProvince: { value: '', disabled: true },
    postalPostalCode: { value: '', disabled: true }
  });

  additionalInfoForm: FormGroup = this.fb.group({});

  checkPersonalFormProgress() {

    let filledCount = 0;
    let totalFields = 0;
    const formControls = this.personalDetailsForm.controls;

    if (this.hasDisability) {
      totalFields = (Object.keys(this.personalDetailsForm.controls).length);
    }
    else {
      totalFields = (Object.keys(this.personalDetailsForm.controls).length) - 2;
    }
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '' && this.hasDisability != false && control.value != "na") {
          filledCount++;
        }
        else if (controlName.includes("disability") && this.hasDisability == false) {
          filledCount++;
        }
      }
    }
    this.personalFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  checkEmployeeFormProgress() {
    let filledCount = 0;
    const formControls = this.employeeDetailsForm.controls;
    const totalFields = Object.keys(this.employeeDetailsForm.controls).length;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.employeeFormProgress = Math.round((filledCount / totalFields) * 100);
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

  checkAddressFormProgress() {
    let filledCount = 0;
    const formControls = this.addressDetailsForm.controls;
    let totalFields = 0;
    if (this.physicalEqualPostal) {
      totalFields = (Object.keys(this.addressDetailsForm.controls).length) / 2;
    }
    else if (!this.physicalEqualPostal) {
      totalFields = (Object.keys(this.addressDetailsForm.controls).length);
    }

    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (this.physicalEqualPostal && controlName.includes("physical") && control.value != null && control.value != " " && control.value != "") {
          filledCount++;
        }
        else if (!this.physicalEqualPostal && control.value != null && control.value != " " && control.value != "") {
          filledCount++;
        }
      }

    }
    this.addressFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  checkAdditionalFormProgress() {

    let filledCount = 0;
    const formControls = this.additionalInfoForm.controls;
    let totalFields = Object.keys(this.additionalInfoForm.controls).length;

    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.additionalFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  totalProfileProgress() {
    this.profileFormProgress = Math.floor((this.employeeFormProgress + this.personalFormProgress + this.additionalFormProgress + this.contactFormProgress + this.additionalFormProgress) / 5);
    this.updateProfile.emit(this.profileFormProgress);
  }
}