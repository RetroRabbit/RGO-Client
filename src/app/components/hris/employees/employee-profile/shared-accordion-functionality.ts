import { Injectable } from '@angular/core';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, NgModule } from '@angular/core';
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
import { AccordionProfileEmployeeDetailsComponent } from './accordions/accordion-profile/accordion-profile-employee-details/accordion-profile-employee-details.component';
@Injectable({
  providedIn: 'root'
})
export class SharedAccordionFunctionality {
  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  @Output() updateProfile = new EventEmitter<number>();
  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

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

  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  initialsPattern = /^[A-Z]+$/;
  namePattern = /^[a-zA-Z\s'-]*$/

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
    public sharedPropertyAccessService: SharedPropertyAccessService) {
  }

  usingProfile: boolean = true;

  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeForm();
    this.initializeEmployeeProfileDto();
    // this.getEmployeeFields();
    // this.getClients();
    // this.checkEmployeeDetails();
  }

  initializeForm() {
    this.employeeDetailsForm = this.fb.group({
      name: [this.employeeProfile!.employeeDetails.name, [Validators.required,
      Validators.pattern(this.namePattern)]],
      surname: [this.employeeProfile!.employeeDetails.surname, [Validators.required,
      Validators.pattern(this.namePattern)]],
      initials: [this.employeeProfile!.employeeDetails.initials, [Validators.pattern(this.initialsPattern)]],
      clientAllocated: this.employeeProfile!.employeeDetails.clientAllocated,
      employeeType: this.employeeProfile!.employeeDetails.employeeType!.name,
      level: this.employeeProfile!.employeeDetails.level,
      teamLead: this.usingProfile ? this.employeeProfile!.employeeDetails.teamLead : this.employeeProfile!.simpleEmployee.teamLeadId,
      dateOfBirth: [this.employeeProfile!.employeeDetails.dateOfBirth, Validators.required],
      idNumber: [this.employeeProfile!.employeeDetails.idNumber, [Validators.required, this.customValidationService.idNumberValidator]],
      engagementDate: [this.employeeProfile!.employeeDetails.engagementDate, Validators.required],
      peopleChampion: this.usingProfile ? this.employeeProfile!.employeeDetails.peopleChampion : this.employeeProfile!.simpleEmployee.peopleChampionId
    });
    this.employeeDetailsForm.disable();
    this.checkEmployeeFormProgress();
    this.checkPropertyPermissions(Object.keys(this.employeeDetailsForm.controls), "Employee", "employeeDetailsForm", true)


    this.employeeContactForm = this.fb.group({
      email: [this.employeeProfile!.employeeDetails.email, [Validators.required, Validators.pattern(this.emailPattern)]],
      personalEmail: [this.employeeProfile!.employeeDetails.personalEmail, [Validators.required, Validators.email, Validators.pattern("[^_\\W\\s@][\\w.!]*[\\w]*[@][\\w]*[.][\\w.]*")]],
      cellphoneNo: [this.employeeProfile!.employeeDetails.cellphoneNo, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      houseNo: [this.employeeProfile!.employeeDetails.houseNo, [Validators.required, Validators.minLength(4), Validators.pattern(/^[0-9]*$/)]],
      emergencyContactName: [this.employeeProfile!.employeeDetails.emergencyContactName, [Validators.required, Validators.pattern(this.namePattern)]],
      emergencyContactNo: [this.employeeProfile!.employeeDetails.emergencyContactNo, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(10)]]
    });
    this.employeeContactForm.disable();
    //  this.checkContactFormProgress();
    this.checkPropertyPermissions(Object.keys(this.employeeContactForm.controls), "Employee", "employeeContactForm", true)





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



  totalProfileProgress() {
    this.profileFormProgress = Math.floor((this.employeeFormProgress + this.personalFormProgress + this.contactFormProgress + this.addressFormProgress + this.additionalFormProgress) / 5);
    this.updateProfile.emit(this.profileFormProgress);
  }


  initializeEmployeeProfileDto() {
    this.employeeProfileDto = {
      id: this.employeeProfile!.employeeDetails.id,
      employeeNumber: this.employeeProfile!.employeeDetails.employeeNumber,
      taxNumber: this.employeeProfile!.employeeDetails.taxNumber,
      engagementDate: this.employeeProfile!.employeeDetails.engagementDate,
      terminationDate: this.employeeProfile!.employeeDetails.terminationDate,
      peopleChampion: this.usingProfile ? this.employeeProfile!.employeeDetails.peopleChampion : this.employeeProfile!.simpleEmployee.peopleChampionId,
      disability: this.employeeProfile!.employeeDetails.disability,
      disabilityNotes: this.employeeProfile!.employeeDetails.disabilityNotes,
      countryOfBirth: this.employeeProfile!.employeeDetails.countryOfBirth,
      nationality: this.employeeProfile!.employeeDetails.nationality,
      level: this.employeeProfile!.employeeDetails.level,
      employeeType: {
        id: this.employeeProfile!.employeeDetails.employeeType!.id,
        name: this.employeeProfile!.employeeDetails.employeeType!.name,
      },
      name: this.employeeProfile!.employeeDetails.name,
      initials: this.employeeProfile!.employeeDetails.initials,
      surname: this.employeeProfile!.employeeDetails.surname,
      dateOfBirth: this.employeeProfile!.employeeDetails.dateOfBirth,
      idNumber: this.employeeProfile!.employeeDetails.idNumber,
      passportNumber: this.employeeProfile!.employeeDetails.passportNumber,
      passportExpirationDate: this.employeeProfile!.employeeDetails.passportExpirationDate,
      passportCountryIssue: this.employeeProfile!.employeeDetails.passportCountryIssue,
      race: this.employeeProfile!.employeeDetails.race,
      gender: this.employeeProfile!.employeeDetails.gender,
      email: this.employeeProfile!.employeeDetails.email,
      personalEmail: this.employeeProfile!.employeeDetails.personalEmail,
      cellphoneNo: this.employeeProfile!.employeeDetails.cellphoneNo,
      photo: this.employeeProfile!.employeeDetails.photo,
      notes: '',
      leaveInterval: this.employeeProfile!.employeeDetails.leaveInterval,
      salary: this.employeeProfile!.employeeDetails.salary,
      salaryDays: this.employeeProfile!.employeeDetails.salaryDays,
      payRate: this.employeeProfile!.employeeDetails.payRate,
      clientAllocated: this.employeeProfile!.employeeDetails.clientAllocated,
      teamLead: this.usingProfile ? this.employeeProfile!.employeeDetails.teamLead : this.employeeProfile!.simpleEmployee.teamLeadId,
      physicalAddress: {
        id: this.employeeProfile!.employeeDetails.physicalAddress?.id,
        unitNumber: this.employeeProfile!.employeeDetails.physicalAddress?.unitNumber,
        complexName: this.employeeProfile!.employeeDetails.physicalAddress?.complexName,
        streetNumber: this.employeeProfile!.employeeDetails.physicalAddress?.streetNumber,
        suburbOrDistrict: this.employeeProfile!.employeeDetails.physicalAddress?.suburbOrDistrict,
        city: this.employeeProfile!.employeeDetails.physicalAddress?.city,
        country: this.employeeProfile!.employeeDetails.physicalAddress?.country,
        province: this.employeeProfile!.employeeDetails.physicalAddress?.province,
        postalCode: this.employeeProfile!.employeeDetails.physicalAddress?.postalCode,
      },
      postalAddress: {
        id: this.employeeProfile!.employeeDetails.postalAddress?.id,
        unitNumber: this.employeeProfile!.employeeDetails.postalAddress?.unitNumber,
        complexName: this.employeeProfile!.employeeDetails.postalAddress?.complexName,
        streetNumber: this.employeeProfile!.employeeDetails.postalAddress?.streetNumber,
        suburbOrDistrict: this.employeeProfile!.employeeDetails.postalAddress?.suburbOrDistrict,
        city: this.employeeProfile!.employeeDetails.postalAddress?.city,
        country: this.employeeProfile!.employeeDetails.postalAddress?.country,
        province: this.employeeProfile!.employeeDetails.postalAddress?.province,
        postalCode: this.employeeProfile!.employeeDetails.postalAddress?.postalCode,
      },
      houseNo: this.employeeProfile?.employeeDetails.houseNo,
      emergencyContactName: this.employeeProfile?.employeeDetails.emergencyContactName,
      emergencyContactNo: this.employeeProfile?.employeeDetails.emergencyContactNo
    }
  }

  getEmployeeFieldCodes() {
    this.fieldCodeService.getAllFieldCodes().subscribe({
      next: data => {
        this.customFields = data.filter((data: FieldCode) => data.category === this.category[0].id);
        //  this.checkAdditionalInformation();
        //this.checkAdditionalFormProgress();
        this.totalProfileProgress();
      }
    })
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
