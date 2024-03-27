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
import { FieldCode } from 'src/app/models/hris/field-code.interface';
import { category } from 'src/app/models/hris/constants/fieldcodeCategory.constants';
import { dataTypes } from 'src/app/models/hris/constants/types.constants';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { AccordionProfilePersonalDetailsComponent } from './accordions/accordion-profile/accordion-profile-personal-details/accordion-profile-personal-details.component';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';

@Injectable({
  providedIn: 'root'
})

export class SharedAccordionFunctionality {
  @Output() updateProfile = new EventEmitter<number>();
  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  // this.employeeFormProgress
  employees: EmployeeProfile[] = [];
  clients: Client[] = [];
  employeeTypes: EmployeeType[] = [];
  filteredClients: any = [];
  filteredEmployees: any = [];
  filteredPeopleChamps: any = [];
  employeeData: EmployeeData[] = [];
  customFields: FieldCode[] = [];

  foundClient: any;
  foundTeamLead: any;
  foundChampion: any;
  employeeProfileDto?: any;
  clientId !: number;
  peopleChampionId !: number;

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

  totalProfileProgress() {
    // this.profileFormProgress = Math.floor((this.employeeFormProgress + this.personalFormProgress + this.contactFormProgress + this.addressFormProgress + this.additionalFormProgress) / 5);
    // this.updateProfile.emit(this.profileFormProgress);
  }
  checkPropertyPermissions(fieldNames: string[], table: string, form: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;

      switch (form) {
        case "employeeDetailsForm":
          control = this.employeeDetailsForm.get(fieldName);
          break;
        case "employeeContactForm":
          control = this.employeeContactForm.get(fieldName);
          break;
        case "addressDetailsForm":
          control = this.addressDetailsForm.get(fieldName);
          break;
        case "additionalInfoForm":
          control = this.additionalInfoForm.get(fieldName);
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
