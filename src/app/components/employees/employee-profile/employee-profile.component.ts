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
  employeeProfile !: EmployeeProfile;
  employeePhysicalAddress !: EmployeeAddress;
  employeePostalAddress !: EmployeeAddress;
  customFields: FieldCode[] = [];
  employeeRoles: any = [];
  clients: Client[] = [];
  employees: EmployeeProfile[] = [];
  employeeTypes: EmployeeType[] = [];
  employeeData: EmployeeData[] = [];

  employeeProfileDto: any;
  employeeAddressDto: any;

  isEdit: boolean = false;
  selectedItem: string = 'Profile Details'; // set the default accordion to Profile Details
  expandedIndex = 0;
  panelOpenState: boolean = false;
  hasDisbility: boolean = false;
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

  employeeDetailsForm!: FormGroup;
  personalDetailsForm!: FormGroup;
  addressDetailsForm!: FormGroup;

  filteredEmployees: any = [];
  filteredClients: any = [];
  employeeId?: number = 0;
  clientId?: number = 0;
  foundClient: any;
  foundTeamLead: any;
  filteredPeopleChamps: any = [];
  peopleChampionId: number = 0;
  foundChampion: any;
  client: string = '';

  client_placeholder: string = '';

  tShirtSizeField!: FieldCode;
  tShirtSizeFieldValue!: EmployeeData;
  dietaryField!: FieldCode;
  dietaryFieldValue!: EmployeeData;
  allergiesField!: FieldCode;
  allergiesFieldValue!: EmployeeData;
  
  employeeDataDto : any;
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
        this.hasDisbility = this.employeeProfile.disability;
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
          }
        });
        this.employeeTypeService.getAllEmployeeTypes().subscribe({
          next: data => {
            this.employeeTypes = data;
          }
        });
        this.initializeForm();
        this.employeeDataService.getEmployeeData(this.employeeProfile.id).subscribe({
          next: data => {
            this.employeeData = data;
            this.getData();
          },
          error: error =>{
            this.toast.error({ detail: "Error", summary: "Failed to Employee Data", duration: 5000, position: 'topRight' });

          }
        });
      }
    });
  }

  getData() {
    let fieldId = this.customFields.filter(field => field.code == 'tsize')[0];
    this.tShirtSizeFieldValue = this.employeeData.filter(data => data.fieldCodeId == fieldId.id)[0];
    if (this.tShirtSizeFieldValue == undefined) {
      console.log(this.allergiesFieldValue);
      this.tShirtSizeFieldValue = {
        id:  (this.customFields[this.customFields.length - 1].id! + 1),
        employeeId: this.employeeProfile.id,
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
      console.log(this.allergiesFieldValue);
      this.dietaryFieldValue = {
        id: (this.customFields[this.customFields.length - 1].id! + 2),
        employeeId: this.employeeProfile.id,
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
      console.log(this.allergiesFieldValue);
      this.allergiesFieldValue = {
        id:  (this.customFields[this.customFields.length - 1].id! + 3),
        employeeId: this.employeeProfile.id,
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
      title: this.employeeProfile.title,
      name: [this.employeeProfile.name, Validators.required],
      surname: [this.employeeProfile.surname, Validators.required],
      initials: this.employeeProfile.initials,
      clientAllocated: this.employeeProfile.clientAllocated,
      employeeType: this.employeeProfile.employeeType.name,
      level: this.employeeProfile.level,
      teamLead: this.employeeProfile.teamLead,
      dateOfBirth: [this.employeeProfile.dateOfBirth, Validators.required],
      idNumber: [this.employeeProfile.idNumber, Validators.required],
      engagementDate: [this.employeeProfile.engagementDate, Validators.required],
      peopleChampion: this.employeeProfile.peopleChampion
    });
    this.employeeDetailsForm.disable();

    this.addressDetailsForm = this.fb.group({
      physicalUnitNumber: [this.employeeProfile.physicalAddress?.unitNumber, Validators.required],
      physicalComplexName: [this.employeeProfile.physicalAddress?.complexName, Validators.required],
      physicalStreetNumber: [this.employeeProfile.physicalAddress?.streetNumber, Validators.required],
      physicalSuburb: [this.employeeProfile.physicalAddress?.suburbOrDistrict, Validators.required],
      physicalCity: [this.employeeProfile.physicalAddress?.city, Validators.required],
      physicalCountry: [this.employeeProfile.physicalAddress?.country, Validators.required],
      physicalProvince: [this.employeeProfile.physicalAddress?.province, Validators.required],
      physicalPostalCode: [this.employeeProfile.physicalAddress?.postalCode, Validators.required],
      postalUnitNumber: [this.employeeProfile.postalAddress?.unitNumber, Validators.required],
      postalComplexName: [this.employeeProfile.postalAddress?.complexName, Validators.required],
      postalStreetNumber: [this.employeeProfile.postalAddress?.streetNumber, Validators.required],
      postalSuburb: [this.employeeProfile.postalAddress?.suburbOrDistrict, Validators.required],
      postalCity: [this.employeeProfile.postalAddress?.city, Validators.required],
      postalCountry: [this.employeeProfile.postalAddress?.country, Validators.required],
      postalProvince: [this.employeeProfile.postalAddress?.province, Validators.required],
      postalPostalCode: [this.employeeProfile.postalAddress?.postalCode, Validators.required]
    });
    this.addressDetailsForm.disable();

    this.personalDetailsForm = this.fb.group({
      gender: [this.employeeProfile.gender,Validators.required],
      race: [this.employeeProfile.race, Validators.required],
      disability: [this.employeeProfile.disability, Validators.required],
      disabilityNotes: [this.employeeProfile.disabilityNotes, Validators.required]
    })
    this.personalDetailsForm.disable();
  }

  checkEmployeeDetails() {
    this.panelOpenState = true
    this.foundTeamLead = this.employees.find((data: any) => {
      return data.id == this.employeeProfile.teamLead
    });
    this.foundClient = this.clients.find((data: any) => {
      return data.id == this.employeeProfile.clientAllocated
    });
    this.foundChampion = this.employeeRoles.find((data: any) => {
      return data.employee.id == this.employeeProfile.clientAllocated
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

      this.employeeProfileDto = {
        id: this.employeeProfile.id,
        employeeNumber: this.employeeProfile.employeeNumber,
        taxNumber: this.employeeProfile.taxNumber,
        engagementDate: this.employeeProfile.engagementDate,
        terminationDate: this.employeeProfile.terminationDate,
        peopleChampion: this.peopleChampionId == 0 ? null : this.peopleChampionId,
        disability: personalDetailsFormValue['disability'],
        disabilityNotes: personalDetailsFormValue['disabilityNotes'],
        countryOfBirth: this.employeeProfile.countryOfBirth,
        nationality: this.employeeProfile.nationality,
        level: +this.employeeProfile.level,
        employeeType: {
          id: this.employeeProfile.employeeType.id,
          name: this.employeeProfile.employeeType.name,
        },
        title: this.employeeProfile.title,
        name: this.employeeProfile.name,
        initials: this.employeeProfile.initials,
        surname: this.employeeProfile.surname,
        dateOfBirth: this.employeeProfile.dateOfBirth,
        idNumber: this.employeeProfile.idNumber,
        passportNumber: this.employeeProfile.passportNumber,
        passportExpirationDate: this.employeeProfile.passportExpirationDate,
        passportCountryIssue: this.employeeProfile.passportCountryIssue,
        race: personalDetailsFormValue['race'],
        gender: personalDetailsFormValue['gender'],
        email: this.employeeProfile.email,
        personalEmail: this.employeeProfile.personalEmail,
        cellphoneNo: this.employeeProfile.cellphoneNo,
        photo: this.employeeProfile.photo,
        notes: '',
        leaveInterval: this.employeeProfile.leaveInterval,
        salary: this.employeeProfile.salary,
        salaryDays: this.employeeProfile.salaryDays,
        payRate: this.employeeProfile.payRate,
        clientAllocated: this.clientId == 0 ? null : this.clientId,
        teamLead: this.employeeId == 0 ? null : this.employeeId,
        physicalAddress: {
          id: this.employeeProfile.physicalAddress?.id,
          unitNumber: this.employeeProfile.physicalAddress?.unitNumber,
          complexName: this.employeeProfile.physicalAddress?.complexName,
          streetNumber: this.employeeProfile.physicalAddress?.streetNumber,
          suburbOrDistrict: this.employeeProfile.physicalAddress?.suburbOrDistrict,
          city: this.employeeProfile.physicalAddress?.city,
          country: this.employeeProfile.physicalAddress?.country,
          province: this.employeeProfile.physicalAddress?.province,
          postalCode: this.employeeProfile.physicalAddress?.postalCode,
        },
        postalAddress: {
          id: this.employeeProfile.postalAddress?.id,
          unitNumber: this.employeeProfile.postalAddress?.unitNumber,
          complexName: this.employeeProfile.postalAddress?.complexName,
          streetNumber: this.employeeProfile.postalAddress?.streetNumber,
          suburbOrDistrict: this.employeeProfile.postalAddress?.suburbOrDistrict,
          city: this.employeeProfile.postalAddress?.city,
          country: this.employeeProfile.postalAddress?.country,
          province: this.employeeProfile.postalAddress?.province,
          postalCode: this.employeeProfile.postalAddress?.postalCode,
        }
      }
      this.employeeService.updateEmployee(this.employeeProfileDto).subscribe({
        next: (data) => {
          this.toast.success({ detail: "Employee Details updated!", position: 'topRight' });
          this.saveCustomFields();
          this.personalDetailsForm.disable();
          this.getEmployeeFields();
        },
        error: (error) => {
          this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' });
        },
      });
    }
  }

  saveCustomFields(){
    this.employeeDataService.updateEmployeeData(this.tShirtSizeFieldValue).subscribe({
      next: () => {},
      error: (error) => {
        this.toast.error({ detail: "Error", summary: "Failed to update T-Shirt", duration: 5000, position: 'topRight' });
      }
    });

    this.employeeDataService.updateEmployeeData(this.dietaryFieldValue).subscribe({
      next: () => {},
      error: (error) => {
        this.toast.error({ detail: "Error", summary: "Failed to update Dietary", duration: 5000, position: 'topRight' });
      }
    });

    this.employeeDataService.updateEmployeeData(this.allergiesFieldValue).subscribe({
      next: () => {},
      error: (error) => {
        this.toast.error({ detail: "Error", summary: "Failed to update Allergies", duration: 5000, position: 'topRight' });
      }
    });
  }
  captureTSizeChange(event:any){
    this.tShirtSizeFieldValue.value = event;
  }
  
  captureDietaryChange(event:any){
    this.dietaryFieldValue.value = event;
  }
  
  captureAllergiesChange(event:any){
    console.log(event.target.value);
    this.allergiesFieldValue.value = event.target.value;
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
        id: this.employeeProfile.physicalAddress?.id!,
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
            id: this.employeeProfile.postalAddress?.id!,
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

  saveEmployeeEdit() {

    this.editEmployee = false;
    if (this.employeeDetailsForm.valid) {
      const employeeDetailsForm = this.employeeDetailsForm.value;

      this.employeeProfileDto = {
        id: this.employeeProfile.id,
        employeeNumber: this.employeeProfile.employeeNumber,
        taxNumber: this.employeeProfile.taxNumber,
        engagementDate: this.employeeProfile.engagementDate,
        terminationDate: this.employeeProfile.terminationDate,
        peopleChampion: this.peopleChampionId == 0 ? null : this.peopleChampionId,
        disability: this.employeeProfile.disability,
        disabilityNotes: this.employeeProfile.disabilityNotes,
        countryOfBirth: this.employeeProfile.countryOfBirth,
        nationality: this.employeeProfile.nationality,
        level: parseInt(employeeDetailsForm.level),
        employeeType: {
          id: this.employeeProfile.employeeType.id,
          name: employeeDetailsForm.employeeType,
        },
        title: employeeDetailsForm.title,
        name: employeeDetailsForm.name,
        initials: employeeDetailsForm.initials,
        surname: employeeDetailsForm.surname,
        dateOfBirth: employeeDetailsForm.dateOfBirth,
        idNumber: employeeDetailsForm.idNumber,
        passportNumber: this.employeeProfile.passportNumber,
        passportExpirationDate: this.employeeProfile.passportExpirationDate,
        passportCountryIssue: this.employeeProfile.passportCountryIssue,
        race: this.employeeProfile.race,
        gender: this.employeeProfile.gender,
        email: this.employeeProfile.email,
        personalEmail: this.employeeProfile.personalEmail,
        cellphoneNo: this.employeeProfile.cellphoneNo,
        photo: this.employeeProfile.photo,
        notes: '',
        leaveInterval: this.employeeProfile.leaveInterval,
        salary: this.employeeProfile.salary,
        salaryDays: this.employeeProfile.salaryDays,
        payRate: this.employeeProfile.payRate,
        clientAllocated: this.clientId == 0 ? null : this.clientId,
        teamLead: this.employeeId == 0 ? null : this.employeeId,
        physicalAddress: {
          id: this.employeeProfile.physicalAddress?.id,
          unitNumber: this.employeeProfile.physicalAddress?.unitNumber,
          complexName: this.employeeProfile.physicalAddress?.complexName,
          streetNumber: this.employeeProfile.physicalAddress?.streetNumber,
          suburbOrDistrict: this.employeeProfile.physicalAddress?.suburbOrDistrict,
          city: this.employeeProfile.physicalAddress?.city,
          country: this.employeeProfile.physicalAddress?.country,
          province: this.employeeProfile.physicalAddress?.province,
          postalCode: this.employeeProfile.physicalAddress?.postalCode,
        },
        postalAddress: {
          id: this.employeeProfile.postalAddress?.id,
          unitNumber: this.employeeProfile.postalAddress?.unitNumber,
          complexName: this.employeeProfile.postalAddress?.complexName,
          streetNumber: this.employeeProfile.postalAddress?.streetNumber,
          suburbOrDistrict: this.employeeProfile.postalAddress?.suburbOrDistrict,
          city: this.employeeProfile.postalAddress?.city,
          country: this.employeeProfile.postalAddress?.country,
          province: this.employeeProfile.postalAddress?.province,
          postalCode: this.employeeProfile.postalAddress?.postalCode,
        }
      }
      this.employeeService.updateEmployee(this.employeeProfileDto).subscribe({
        next: (data) => {
          this.toast.success({ detail: "Employee Details updated!", position: 'topRight' });
          this.employeeDetailsForm.disable();
        },
        error: (error) => { console.log(error); this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' }); },
      });
    }
  }

  cancelEmployeeEdit() {
    this.editEmployee = false;
    this.employeeDetailsForm.reset();
    this.initializeForm();
    this.employeeDetailsForm.disable();

  }


  editContactDetails() {
    this.editContact = true;
  }


  saveContactEdit() {
    this.editContact = false;
  }


  cancelContactEdit() {
    this.editContact = false;
  }

  filterEmployees(event: any) {
    if (event) {
      this.filteredEmployees = this.employees.filter((employee: { name: string; }) =>
        employee.name.toLowerCase().includes(event.target.value.toLowerCase())
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
      this.employeeId = data.id
    }
    else if (name == 'client') {
      this.clientId = data.id
      // this.employeeProfile.clientAllocated = data.id
    }
    else if (name == 'champion') {
      this.peopleChampionId = data.employee.id
    }
  }

}