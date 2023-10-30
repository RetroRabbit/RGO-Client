import { Component } from '@angular/core';
import { AccessPropertiesService } from 'src/app/services/access-properties.service';
import { Properties } from 'src/app/models/properties.interface';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
import { race } from 'src/app/models/constants/race.constants';
import { gender } from 'src/app/models/constants/gender.constants';
import { tshirtSize } from 'src/app/models/constants/tshirt.constants';
import { countries } from 'src/app/models/constants/country.constants';
import { disabilities } from 'src/app/models/constants/disabilities.constant';
import { provinces } from 'src/app/models/constants/provinces.constants';
import { EmployeeAddressService } from 'src/app/services/employee/employee-address.service';
import { FieldCode } from 'src/app/models/field-code.interface';
import { FieldCodeService } from 'src/app/services/field-code.service';
import { NgToastService } from 'ng-angular-popup';
import { ClientService } from 'src/app/services/client.service';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';
import { Client } from 'src/app/models/client.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { EmployeeTypeService } from 'src/app/services/employee/employee-type.service';
import { level } from 'src/app/models/constants/level.constants';

import { EmployeeAddress } from 'src/app/models/employee-address.interface';
import { EmployeeDataService } from 'src/app/services/employee-data.service';
import { EmployeeData } from 'src/app/models/employee-data.interface';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  employeeFields: Properties[] = [];
  editFields: Properties[] = [];
  employeeProfile: EmployeeProfile | undefined;
  employeePhysicalAddress !: EmployeeAddress;
  employeePostalAddress !: EmployeeAddress;
  customFields: FieldCode[] = [];
  employeeRoles: any = [];
  clients: Client[] = [];
  employees: EmployeeProfile[] = [];
  employeeTypes: EmployeeType[] = [];
  employeeData: EmployeeData[] = [];

  employeeProfileDto?: any;
  employeeType?: EmployeeType;
  employeeAddressDto: any;

  isEdit: boolean = false;
  selectedItem: string = 'Profile Details';
  expandedIndex = 0;
  panelOpenState: boolean = false;
  hasDisbility: boolean | undefined = false;
  physicalEqualPostal: boolean = false;

  public genders = gender;
  public races = race;
  public levels = level;
  public sizes = tshirtSize;
  public countries = countries;
  public disabilities = disabilities;
  public provinces = provinces;

  editContact: boolean = false;
  editEmployee: boolean = false;
  editPersonal: boolean = false;
  editAddress: boolean = false;

  physicalCountryControl: string = "";
  postalCountryControl: string = "";

  employeeClient : EmployeeProfile | undefined;
  employeeTeamLead : EmployeeProfile | undefined;
  employeePeopleChampion : EmployeeProfile | undefined;

  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;

  employeeFormProgress: number = 0;
  personalFormProgress: number = 0;
  contactFormProgress: number = 0;
  addressFormProgress: number = 0;
  profileFormProgress: number = 0;
  overallFormProgress: number = 0;

  employeeDetailsForm: FormGroup = this.fb.group({
    title: { value: '', disabled: true },
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

  employeeContactForm: FormGroup = this.fb.group({
    email: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.emailPattern)]],
    personalEmail: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    cellphoneNo: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    houseNo: { value: '', disabled: true },
    emergencyContactName: { value: '', disabled: true },
    emergencyContactNo: { value: '', disabled: true }
  });

  personalDetailsForm: FormGroup =this.fb.group({
    gender: { value: '', disabled: true },
    race: { value: '', disabled: true },
    disability: { value: '', disabled: true },
    disabilityNotes: { value: '', disabled: true },
    disabilityList: {value: '', disabled: true}
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
  
  filteredEmployees: any = [];
  filteredClients: any = [];
  employeeId? = null;
  clientId? = null;
  foundClient: any;
  foundTeamLead: any;
  filteredPeopleChamps: any = [];
  peopleChampionId = null;
  foundChampion: any;
  client: string = '';

  clientPlaceholder: string = '';

  tShirtSizeField!: FieldCode;
  tShirtSizeFieldValue: EmployeeData | undefined;
  dietaryField!: FieldCode;
  dietaryFieldValue: EmployeeData | undefined;
  allergiesField!: FieldCode;
  allergiesFieldValue: EmployeeData | undefined;

  employeeDataDto!: EmployeeData;

  filteredCountries: any[] = this.countries.slice();
  constructor(private accessPropertyService: AccessPropertiesService,
    private cookieService: CookieService,
    private employeeProfileService: EmployeeProfileService,
    private employeeAddressService: EmployeeAddressService,
    private customFieldsService: FieldCodeService,
    private clientService: ClientService,
    private employeeRoleService: EmployeeRoleService,
    private toast: NgToastService,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private employeeTypeService: EmployeeTypeService,
    private employeeDataService: EmployeeDataService) { }

  ngOnInit() {
    this.getEmployeeFields();
  }
  
  getEmployeeFields() {
    this.employeeProfileService.GetEmployeeProfile().subscribe({
      next: data => {
        this.employeeProfile = data;
        this.employeePhysicalAddress = data.physicalAddress!;
        this.employeePostalAddress = data.postalAddress!;
        this.hasDisbility = this.employeeProfile!.disability; 
        this.customFieldsService.getAllFieldCodes().subscribe({
          next: data => {
            this.customFields = data;
            this.tShirtSizeField = this.customFields.filter(field => field.code == 'tsize')[0];
            this.dietaryField = this.customFields.filter(field => field.code == 'dietary')[0];
            this.allergiesField = this.customFields.filter(field => field.code == 'allergies')[0];
          },
          error: (error) => {
            this.toast.error({ detail: "Error", summary: "Failed to fetch addition informaion", duration: 5000, position: 'topRight' });
          }
        });
        this.employeeRoleService.getEmployeeOnRoles(4).subscribe({
          next: data => {
            this.employeeRoles = data;
          }
        });
        this.clientService.getAllClients().subscribe({
          next: data => {
            this.clients = data;
          }
        });
        this.employeeService.getAllProfiles().subscribe({
          next: data => {
            this.employees = data;
            this.employeeClient = this.employees.filter((employee : EmployeeProfile) => employee.id === this.employeeProfile?.id)[0];
            this.employeeTeamLead = this.employees.filter((employee : EmployeeProfile) => employee.id === this.employeeProfile?.teamLead)[0];
            this.employeePeopleChampion = this.employees.filter((employee : EmployeeProfile) => employee.id === this.employeeProfile?.peopleChampion)[0];
          }
        });
        this.employeeTypeService.getAllEmployeeTypes().subscribe({
          next: data => {
            this.employeeTypes = data;
            this.initializeEmployeeProfileDto();
          }
        });
      
        this.employeeDataService.getEmployeeData(this.employeeProfile?.id).subscribe({
          next: data => {
            this.employeeData = data;
            this.getData();
          },
          error: error => {
            this.toast.error({ detail: "Error", summary: "Failed to Employee Data", duration: 5000, position: 'topRight' });
          }
        });
        this.initializeForm(); 
      }
    });
  }

  getData() {
    let fieldId = this.customFields.filter(field => field.code == 'tsize')[0];
    this.tShirtSizeFieldValue = this.employeeData.filter(data => data.fieldCodeId == fieldId.id)[0];
    if (this.tShirtSizeFieldValue == undefined) {
      this.tShirtSizeFieldValue = {
        id: (this.customFields[this.customFields.length - 1].id! + 1),
        employeeId: this.employeeProfile!.id,
        fieldCodeId: fieldId.id,
        value: 'Unknown'
      };
      this.employeeDataService.saveEmployeeData(this.tShirtSizeFieldValue).subscribe(data => {
        error: () => {
          this.toast.error({ detail: "Error", summary: "Failed to fetch T-Size", duration: 5000, position: 'topRight' });
        }
      });
    }
    this.personalDetailsForm.addControl('tsize', this.fb.control(this.tShirtSizeFieldValue.value));

    fieldId = this.customFields.filter(field => field.code == 'dietary')[0];
    this.dietaryFieldValue = this.employeeData.filter(data => data.fieldCodeId == fieldId.id)[0];

    if (this.dietaryFieldValue == undefined) {
      this.dietaryFieldValue = {
        id: (this.customFields[this.customFields.length - 1].id! + 2),
        employeeId: this.employeeProfile!.id,
        fieldCodeId: fieldId.id,
        value: 'None'
      };
      this.employeeDataService.saveEmployeeData(this.dietaryFieldValue).subscribe(data => {
        error: () => {
          this.toast.error({ detail: "Error", summary: "Failed to fetch Dietary", duration: 5000, position: 'topRight' });
        }
      });
    }
    this.personalDetailsForm.addControl('dietary', this.fb.control(this.dietaryFieldValue.value));

    fieldId = this.customFields.filter(field => field.code == 'allergies')[0];
    this.allergiesFieldValue = this.employeeData.filter(data => data.fieldCodeId == fieldId.id)[0];
    if (this.allergiesFieldValue == undefined) {
      this.allergiesFieldValue = {
        id: (this.customFields[this.customFields.length - 1].id! + 3),
        employeeId: this.employeeProfile!.id,
        fieldCodeId: fieldId.id,
        value: 'None'
      };
      this.employeeDataService.saveEmployeeData(this.allergiesFieldValue).subscribe(data => {
        error: () => {
          this.toast.error({ detail: "Error", summary: "Failed to fetch allergies", duration: 5000, position: 'topRight' });
        }
      });
    }
    this.personalDetailsForm.addControl('allergies', this.fb.control(this.allergiesFieldValue.value));

  }

  initializeForm() {
    this.employeeDetailsForm = this.fb.group({
      title: this.employeeProfile!.title,
      name: [this.employeeProfile!.name, Validators.required],
      surname: [this.employeeProfile!.surname, Validators.required],
      initials: this.employeeProfile!.initials,
      clientAllocated: this.employeeProfile!.clientAllocated,
      employeeType: this.employeeProfile!.employeeType!.name,
      level: this.employeeProfile!.level,
      teamLead: this.employeeProfile!.teamLead,
      dateOfBirth: [this.employeeProfile!.dateOfBirth, Validators.required],
      idNumber: [this.employeeProfile!.idNumber, Validators.required],
      engagementDate: [this.employeeProfile!.engagementDate, Validators.required],
      peopleChampion: this.employeeProfile!.peopleChampion
    });
    this.employeeDetailsForm.disable();
    this.checkEmployeeFormProgress();

    this.employeeContactForm = this.fb.group({
      email: [this.employeeProfile!.email, [Validators.required,
      Validators.pattern(this.emailPattern)]],
      personalEmail: [this.employeeProfile!.personalEmail, [Validators.required, Validators.email]],
      cellphoneNo: [this.employeeProfile!.cellphoneNo, [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
      ]],
      houseNo: [this.employeeProfile!.houseNo, Validators.required],
      emergencyContactName: [this.employeeProfile!.emergencyContactName, Validators.required],
      emergencyContactNo: [this.employeeProfile!.emergencyContactNo, Validators.required]
    });
    this.employeeContactForm.disable();
    this.checkContactFormProgress();

    this.addressDetailsForm = this.fb.group({
      physicalUnitNumber: [this.employeeProfile!.physicalAddress?.unitNumber, Validators.required],
      physicalComplexName: [this.employeeProfile!.physicalAddress?.complexName, Validators.required],
      physicalStreetNumber: [this.employeeProfile!.physicalAddress?.streetNumber, Validators.required],
      physicalSuburb: [this.employeeProfile!.physicalAddress?.suburbOrDistrict, Validators.required],
      physicalCity: [this.employeeProfile!.physicalAddress?.city, Validators.required],
      physicalCountry: [this.employeeProfile!.physicalAddress?.country, Validators.required],
      physicalProvince: [this.employeeProfile!.physicalAddress?.province, Validators.required],
      physicalPostalCode: [this.employeeProfile!.physicalAddress?.postalCode, Validators.required],
      postalUnitNumber: [this.employeeProfile!.postalAddress?.unitNumber, Validators.required],
      postalComplexName: [this.employeeProfile!.postalAddress?.complexName, Validators.required],
      postalStreetNumber: [this.employeeProfile!.postalAddress?.streetNumber, Validators.required],
      postalSuburb: [this.employeeProfile!.postalAddress?.suburbOrDistrict, Validators.required],
      postalCity: [this.employeeProfile!.postalAddress?.city, Validators.required],
      postalCountry: [this.employeeProfile!.postalAddress?.country, Validators.required],
      postalProvince: [this.employeeProfile!.postalAddress?.province, Validators.required],
      postalPostalCode: [this.employeeProfile!.postalAddress?.postalCode, Validators.required]
    });
    this.addressDetailsForm.disable();
    this.checkAddressFormProgress();
             
    this.personalDetailsForm = this.fb.group({
      gender: [this.employeeProfile!.gender, Validators.required],
      race: [this.employeeProfile!.race, Validators.required],
      disability: [this.employeeProfile!.disability, Validators.required],
      disabilityList: "",
      disabilityNotes: [this.employeeProfile!.disabilityNotes, Validators.required]
    })
    this.personalDetailsForm.disable();
    this.checkPersonalFormProgress();
    this.totalProfileProgress();
  }

  checkEmployeeDetails() {
    this.panelOpenState = true;
    this.foundTeamLead = this.employees.find((data: any) => {
      return data.id == this.employeeProfile!.teamLead
    });
    this.foundClient = this.clients.find((data: any) => {
      return data.id == this.employeeProfile!.clientAllocated
    });
    this.foundChampion = this.employeeRoles.find((data: any) => {
      return data.employee.id == this.employeeProfile!.peopleChampion
    });

    if (this.foundTeamLead != null) {
      this.employeeDetailsForm.get('teamLead')?.setValue(this.foundTeamLead.name + ' ' + this.foundTeamLead.surname);
      this.employeeId = this.foundTeamLead.id
    }

    if (this.foundClient != null) {
      this.employeeDetailsForm.get('clientAllocated')?.setValue(this.foundClient.name);
      this.clientId = this.foundClient.id
    }
    
    if (this.foundChampion != null) {
      this.employeeDetailsForm.get('peopleChampion')?.setValue(this.foundChampion.employee.name + ' ' + this.foundChampion.employee.surname);
      this.peopleChampionId = this.foundChampion.employee.id
    }
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.selectedItem = target.innerText;
  }

  filterCountries(value: any) {
    const filterValue = value.target.value.toLowerCase();
    this.filteredCountries = this.countries.filter(
      (country) => country.toLowerCase().includes(filterValue)
    );
  }

  setHasDisability(event: any) {
    this.hasDisbility = event.value;
  }


  editPersonalDetails() {
    this.editPersonal = true;
    this.personalDetailsForm.enable();
  }

  savePersonalEdit() {
    this.editPersonal = false;
    if (this.personalDetailsForm.valid) {
      const personalDetailsFormValue = this.personalDetailsForm.value;
      this.employeeProfileDto.disability = personalDetailsFormValue.disability;
      this.employeeProfileDto.disabilityNotes = personalDetailsFormValue.disabilityNotes;
      this.employeeProfileDto.race = personalDetailsFormValue.race;
      this.employeeProfileDto.gender = personalDetailsFormValue.gender;

      this.employeeService.updateEmployee(this.employeeProfileDto).subscribe({
        next: (data) => {
          this.toast.success({ detail: "Employee Details updated!", position: 'topRight' });
          this.saveCustomFields();
          this.checkPersonalFormProgress();
          this.totalProfileProgress();
          this.personalDetailsForm.disable();
          this.getEmployeeFields();
        },
        error: (error) => {
          this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' });
        },
      });
    }
    else{
      this.toast.error({ detail: "Error", summary: "Please fill in the required fields", duration: 5000, position: 'topRight' });
    }
  }

  saveCustomFields() {
    this.employeeDataService.updateEmployeeData(this.tShirtSizeFieldValue!).subscribe({
      next: () => { },
      error: (error) => {
        this.toast.error({ detail: "Error", summary: "Failed to update T-Shirt", duration: 5000, position: 'topRight' });
      }
    });

    this.employeeDataService.updateEmployeeData(this.dietaryFieldValue!).subscribe({
      next: () => { },
      error: (error) => {
        this.toast.error({ detail: "Error", summary: "Failed to update Dietary", duration: 5000, position: 'topRight' });
      }
    });

    this.employeeDataService.updateEmployeeData(this.allergiesFieldValue!).subscribe({
      next: () => { },
      error: (error) => {
        this.toast.error({ detail: "Error", summary: "Failed to update Allergies", duration: 5000, position: 'topRight' });
      }
    });
  }
  captureTShirtSizeChange(event: any) {
    this.tShirtSizeFieldValue!.value = event;
  }

  captureDietaryChange(event: any) {
    this.dietaryFieldValue!.value = event;
  }

  captureAllergiesChange(event: any) {
    this.allergiesFieldValue!.value = event.target.value;
  }

  cancelPersonalEdit() {
    this.editPersonal = false;
    this.hasDisbility = false;
  }

  editAddressDetails() {
    this.editAddress = true;
    this.addressDetailsForm.enable();
  }

  saveAddressEdit() {
    this.editAddress = false;
    if (this.addressDetailsForm.valid) {
      const addressDetailFormValue = this.addressDetailsForm.value;
      this.employeeAddressDto = {
        id: this.employeeProfile!.physicalAddress?.id!,
        unitNumber: addressDetailFormValue['physicalUnitNumber'],
        complexName: addressDetailFormValue['physicalComplexName'],
        streetNumber: addressDetailFormValue['physicalStreetNumber'],
        suburbOrDistrict: addressDetailFormValue['physicalSuburb'],
        city: addressDetailFormValue['physicalCity'],
        country: addressDetailFormValue['physicalCountry'],
        province: addressDetailFormValue['physicalProvince'],
        postalCode: addressDetailFormValue['physicalPostalCode'],
      }
      this.employeeAddressService.update(this.employeeAddressDto).subscribe({
        next: (data) => {
          this.employeeAddressDto = {
            id: this.employeeProfile!.postalAddress?.id!,
            unitNumber: this.physicalEqualPostal ? addressDetailFormValue['physicalUnitNumber'] : addressDetailFormValue['postalUnitNumber'],
            complexName: this.physicalEqualPostal ? addressDetailFormValue['physicalComplexName'] : addressDetailFormValue['postalComplexName'],
            streetNumber: this.physicalEqualPostal ? addressDetailFormValue['physicalStreetNumber'] : addressDetailFormValue['postalStreetNumber'],
            suburbOrDistrict: this.physicalEqualPostal ? addressDetailFormValue['physicalSuburb'] : addressDetailFormValue['postalSuburb'],
            city: this.physicalEqualPostal ? addressDetailFormValue['physicalCity'] : addressDetailFormValue['postalCity'],
            country: this.physicalEqualPostal ? addressDetailFormValue['physicalCountry'] : addressDetailFormValue['postalCountry'],
            province: this.physicalEqualPostal ? addressDetailFormValue['physicalProvince'] : addressDetailFormValue['postalProvince'],
            postalCode: this.physicalEqualPostal ? addressDetailFormValue['physicalPostalCode'] : addressDetailFormValue['postalPostalCode'],
          }
          this.employeeAddressService.update(this.employeeAddressDto).subscribe({
            next: (data) => {
              this.toast.success({ detail: "Employee Address updated!", position: 'topRight' });
              this.addressDetailsForm.disable();
              this.checkAddressFormProgress();
              this.totalProfileProgress();
              this.getEmployeeFields();
            },
            error: (error) => {
              this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' });
            },
          });
        },
        error: (error) => { this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' }); },
      });
    }
    else{
      this.toast.error({ detail: "Error", summary: "Please fill in the required fields", duration: 5000, position: 'topRight' });
    }
  }

  cancelAddressEdit() {
    this.editAddress = false;
    this.hasDisbility = false;
    this.addressDetailsForm.disable();
  }

  toggleEqualFields() {
    this.physicalEqualPostal = !this.physicalEqualPostal;
  }

  editEmployeeDetails() {
    this.employeeDetailsForm.enable();
    this.editEmployee = true;
  }

  initializeEmployeeProfileDto() {
    this.employeeProfileDto = {
      id: this.employeeProfile!.id,
      employeeNumber: this.employeeProfile!.employeeNumber,
      taxNumber: this.employeeProfile!.taxNumber,
      engagementDate: this.employeeProfile!.engagementDate,
      terminationDate: this.employeeProfile!.terminationDate,
      peopleChampion: this.employeeProfile!.peopleChampion,
      disability: this.employeeProfile!.disability,
      disabilityNotes: this.employeeProfile!.disabilityNotes,
      countryOfBirth: this.employeeProfile!.countryOfBirth,
      nationality: this.employeeProfile!.nationality,
      level: this.employeeProfile!.level,
      employeeType: {
        id: this.employeeProfile!.employeeType!.id,
        name: this.employeeProfile!.employeeType!.name,
      },
      title: this.employeeProfile!.title,
      name: this.employeeProfile!.name,
      initials: this.employeeProfile!.initials,
      surname: this.employeeProfile!.surname,
      dateOfBirth: this.employeeProfile!.dateOfBirth,
      idNumber: this.employeeProfile!.idNumber,
      passportNumber: this.employeeProfile!.passportNumber,
      passportExpirationDate: this.employeeProfile!.passportExpirationDate,
      passportCountryIssue: this.employeeProfile!.passportCountryIssue,
      race: this.employeeProfile!.race,
      gender: this.employeeProfile!.gender,
      email: this.employeeProfile!.email,
      personalEmail: this.employeeProfile!.personalEmail,
      cellphoneNo: this.employeeProfile!.cellphoneNo,
      photo: this.employeeProfile!.photo,
      notes: '',
      leaveInterval: this.employeeProfile!.leaveInterval,
      salary: this.employeeProfile!.salary,
      salaryDays: this.employeeProfile!.salaryDays,
      payRate: this.employeeProfile!.payRate,
      clientAllocated: this.employeeProfile!.clientAllocated,
      teamLead: this.employeeProfile!.teamLead,
      physicalAddress: {
        id: this.employeeProfile!.physicalAddress?.id,
        unitNumber: this.employeeProfile!.physicalAddress?.unitNumber,
        complexName: this.employeeProfile!.physicalAddress?.complexName,
        streetNumber: this.employeeProfile!.physicalAddress?.streetNumber,
        suburbOrDistrict: this.employeeProfile!.physicalAddress?.suburbOrDistrict,
        city: this.employeeProfile!.physicalAddress?.city,
        country: this.employeeProfile!.physicalAddress?.country,
        province: this.employeeProfile!.physicalAddress?.province,
        postalCode: this.employeeProfile!.physicalAddress?.postalCode,
      },
      postalAddress: {
        id: this.employeeProfile!.postalAddress?.id,
        unitNumber: this.employeeProfile!.postalAddress?.unitNumber,
        complexName: this.employeeProfile!.postalAddress?.complexName,
        streetNumber: this.employeeProfile!.postalAddress?.streetNumber,
        suburbOrDistrict: this.employeeProfile!.postalAddress?.suburbOrDistrict,
        city: this.employeeProfile!.postalAddress?.city,
        country: this.employeeProfile!.postalAddress?.country,
        province: this.employeeProfile!.postalAddress?.province,
        postalCode: this.employeeProfile!.postalAddress?.postalCode,
      },
      houseNo: this.employeeProfile?.houseNo,
      emergencyContactName: this.employeeProfile?.emergencyContactName,
      emergencyContactNo: this.employeeProfile?.emergencyContactNo
    }
  }


  saveEmployeeEdit() {
    this.editEmployee = false;
    if (this.employeeDetailsForm.valid) {
      const employeeDetailsForm = this.employeeDetailsForm.value;

      this.employeeType = this.employeeTypes.find((data: any) => {
        return data.name == employeeDetailsForm.employeeType
      });

      this.employeeProfileDto.title = employeeDetailsForm.title;
      this.employeeProfileDto.name = employeeDetailsForm.name;
      this.employeeProfileDto.surname = employeeDetailsForm.surname;
      this.employeeProfileDto.clientAllocated = this.employeeDetailsForm.controls["clientAllocated"].value == "" ? null : this.clientId;
      this.employeeProfileDto.employeeType.id = this.employeeType !== null ? this.employeeType?.id : this.employeeProfile!.employeeType!.id;
      this.employeeProfileDto.employeeType.name = this.employeeType !== null ? this.employeeType?.name : this.employeeProfile!.employeeType!.name;
      this.employeeProfileDto.level = employeeDetailsForm.level;
      this.employeeProfileDto.teamLead = this.employeeDetailsForm.controls["teamLead"].value == 0 ? null : this.employeeId;
      this.employeeProfileDto.peopleChampion = this.employeeDetailsForm.controls["peopleChampion"].value == "" ? null : this.peopleChampionId
      this.employeeProfileDto.dateOfBirth = employeeDetailsForm.dateOfBirth;
      this.employeeProfileDto.idNumber = employeeDetailsForm.idNumber;
      this.employeeProfileDto.engagementDate = employeeDetailsForm.engagementDate;

      this.employeeService.updateEmployee(this.employeeProfileDto).subscribe({
        next: (data) => {
          this.toast.success({ detail: "Employee Details updated!", position: 'topRight' });
          this.checkEmployeeFormProgress();
          this.totalProfileProgress();
          this.employeeDetailsForm.disable();
        },
        error: (error) => { this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' }); },
      });
    }
    else{
      this.toast.error({ detail: "Error", summary: "Please fill in the required fields", duration: 5000, position: 'topRight' });
    }
  }

  cancelEmployeeEdit() {
    this.editEmployee = false;
    this.employeeDetailsForm.reset();
    this.initializeForm();
    this.employeeDetailsForm.disable();
  }


  editContactDetails() {
    this.employeeContactForm.enable();
    this.editContact = true;
  }


  saveContactEdit() {
    this.editContact = false;
    if (this.employeeContactForm.valid) {
      const employeeContactForm = this.employeeContactForm.value;

      this.employeeProfileDto.personalEmail = employeeContactForm.personalEmail;
      this.employeeProfileDto.email = employeeContactForm.email;
      this.employeeProfileDto.cellphoneNo = employeeContactForm.cellphoneNo;
      this.employeeProfileDto.emergencyContactName = employeeContactForm.emergencyContactName;
      this.employeeProfileDto.emergencyContactNo = employeeContactForm.emergencyContactNo;
      this.employeeProfileDto.houseNo = employeeContactForm.houseNo;

      this.employeeService.updateEmployee(this.employeeProfileDto).subscribe({
        next: (data) => {
          this.toast.success({ detail: "Employee Details updated!", position: 'topRight' });
          this.checkContactFormProgress();
          this.totalProfileProgress();
          this.employeeContactForm.disable();
        },
        error: (error) => { this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' }); },
      });
    }
    else{
      this.toast.error({ detail: "Error", summary: "Please fill in the required fields", duration: 5000, position: 'topRight' });
    }
  }

  cancelContactEdit() {
    this.editContact = false;
    this.employeeContactForm.reset();
    this.initializeForm();
    this.employeeContactForm.disable();
  }

  filterEmployees(event: any) {
    if (event) {
      this.filteredEmployees = this.employees.filter((employee: EmployeeProfile) =>
        employee.name!.toLowerCase().includes(event.target.value.toLowerCase())
      );
    } else {
      this.filteredEmployees = this.employees;
    }
  }


  filterClients(event: any) {
    if (event) {
      this.filteredClients = this.clients.filter((client: { name: string; }) =>
        client.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
    } else {
      this.filteredClients = this.clients;
    }
  }

  filterChampions(event: any) {
    if (event) {
      this.filteredPeopleChamps = this.employeeRoles.filter((champs: any) =>
        champs.employee.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
    } else {
      this.filteredPeopleChamps = this.employeeRoles.employee.name;
    }
  }

  getId(data: any, name: string) {
    if (name == 'employee') {
      this.employeeId = data.id;
    }
    else if (name == 'client') {
      this.clientId = data.id;
    }
    else if (name == 'champion') {
      this.peopleChampionId = data.employee.id;
      console.log(this.peopleChampionId)
      console.log(data)
      console.log(name)
    }
  }

  checkEmployeeFormProgress(){
    console.log("hello")
    let filledCount = 0;
    const formControls = this.employeeDetailsForm.controls;
    const totalFields = Object.keys(this.employeeDetailsForm.controls).length;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        console.log(control)
        console.log("hello2")
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.employeeFormProgress = Math.round((filledCount / totalFields) * 100);
    console.log(filledCount / totalFields * 100)
    console.log(Math.floor((filledCount / totalFields) * 100))
  }
 
  checkPersonalFormProgress(){
    let filledCount = 0;
    let totalFields = 0;
    const formControls = this.personalDetailsForm.controls;

    if(this.hasDisbility){
      totalFields = (Object.keys(this.personalDetailsForm.controls).length);
      console.log(totalFields);
    }
    else{
      totalFields = (Object.keys(this.personalDetailsForm.controls).length)-2;
      console.log(totalFields);
    }
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        console.log(control)
        if (control.value != null && control.value != '' && control.value != false && control.value != "na") {
          filledCount++;
        }
      }
    }
    this.personalFormProgress = Math.round((filledCount / totalFields) * 100);
    console.log(filledCount / totalFields * 100)
    console.log(Math.floor((filledCount / totalFields) * 100))
  }

  checkContactFormProgress(){
    let filledCount = 0;
    const formControls = this.employeeContactForm.controls;
    const totalFields = Object.keys(this.employeeContactForm.controls).length;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        console.log(control)
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.contactFormProgress = Math.round((filledCount / totalFields) * 100);
    console.log(filledCount / totalFields * 100)
    console.log(Math.floor((filledCount / totalFields) * 100))
  }

  checkAddressFormProgress(){
    let filledCount = 0;
    const formControls = this.addressDetailsForm.controls;
    let totalFields = 0;
    if(this.physicalEqualPostal){
      totalFields = (Object.keys(this.addressDetailsForm.controls).length)/2;
      console.log(totalFields);
    }
    else if(!this.physicalEqualPostal){
      totalFields = (Object.keys(this.addressDetailsForm.controls).length);
      console.log(totalFields);
    }

    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        console.log(control)
        if (this.physicalEqualPostal && controlName.includes("physical") && control.value != null && control.value != '') {
          filledCount++;
        }
        else if (!this.physicalEqualPostal  && control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    console.log(filledCount)
    this.addressFormProgress = Math.round((filledCount / totalFields) * 100);
    console.log(filledCount / totalFields * 100)
    console.log(Math.floor((filledCount / totalFields) * 100))
  }


  totalProfileProgress(){
    console.log(this.employeeFormProgress);
    console.log(this.personalFormProgress);
    console.log(this.contactFormProgress);
    console.log(this.addressFormProgress)
    this.profileFormProgress = Math.floor((this.employeeFormProgress + this.personalFormProgress + this.contactFormProgress + this.addressFormProgress) / 4);
    this.overallProgress();
    console.log(this.profileFormProgress)
  }

  overallProgress(){
    this.overallFormProgress = 0.25 * this.profileFormProgress;
  }

}