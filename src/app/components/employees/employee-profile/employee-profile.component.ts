import { Component, Input } from '@angular/core';
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
import { EmployeeAddressService } from 'src/app/services/employee/employee-address.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  @Input() selectedEmployee!: EmployeeProfile | null;
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
  employeeProfileDto: any;
  employeeType?: EmployeeType;
  employeeAddressDto: any;

  isEdit: boolean = false;
  selectedItem: string = 'Profile Details';
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
  employeeContactForm!: FormGroup;
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

  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;

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
    private employeeTypeService: EmployeeTypeService) { }

  ngOnInit() {
    console.info(`Profile: ${this.selectedEmployee}`)
    this.getEmployeeFields();
  }

  getEmployeeFields() {
    this.accessPropertyService.GetAccessProperties(this.selectedEmployee ? this.selectedEmployee.email : this.cookieService.get('userEmail')).subscribe({
      next: data => {
        this.employeeFields = data;
      }
    });
    this.employeeProfileService.GetEmployeeProfile().subscribe({
      next: data => {
        this.employeeProfile = data;
        this.employeePhysicalAddress = data.physicalAddress!;
        this.employeePostalAddress = data.postalAddress!;
        this.customFieldsService.getAllFieldCodes().subscribe({
          next: data => {
            this.customFields = data;
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
            this.initializeEmployeeProfileDto();
          }
        });
        this.initializeForm(this.selectedEmployee ? this.selectedEmployee : this.employeeProfile);
      }
    });
  }

  initializeForm(employee: EmployeeProfile) {
    this.employeeDetailsForm = this.fb.group({
      title: employee.title,
      name: [employee.name, Validators.required],
      surname: [employee.surname, Validators.required],
      initials: employee.initials,
      clientAllocated: employee.clientAllocated,
      employeeType: employee.employeeType.name,
      level: employee.level,
      teamLead: employee.teamLead,
      dateOfBirth: [employee.dateOfBirth, Validators.required],
      idNumber: [employee.idNumber, Validators.required],
      engagementDate: [employee.engagementDate, Validators.required],
      peopleChampion: employee.peopleChampion
    });
    this.employeeDetailsForm.disable();

    this.employeeContactForm = this.fb.group({
      email: [employee.email, [Validators.required,
      Validators.pattern(this.emailPattern)]],
      personalEmail: [employee.personalEmail, [Validators.required, Validators.email]],
      cellphoneNo: [employee.cellphoneNo, [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
      ]],
      houseNo: [employee.houseNo, Validators.required],
      emergencyContactName: [employee.emergencyContactName, Validators.required],
      emergencyContactNo: [employee.emergencyContactNo, Validators.required]
    });
    this.employeeContactForm.disable();

    this.addressDetailsForm = this.fb.group({
      physicalUnitNumber: [employee.physicalAddress?.unitNumber, Validators.required],
      physicalComplexName: [employee.physicalAddress?.complexName, Validators.required],
      physicalStreetNumber: [employee.physicalAddress?.streetNumber, Validators.required],
      physicalSuburb: [employee.physicalAddress?.suburbOrDistrict, Validators.required],
      physicalCity: [employee.physicalAddress?.city, Validators.required],
      physicalCountry: [employee.physicalAddress?.country, Validators.required],
      physicalProvince: [employee.physicalAddress?.province, Validators.required],
      physicalPostalCode: [employee.physicalAddress?.postalCode, Validators.required],
      postalUnitNumber: [employee.postalAddress?.unitNumber, Validators.required],
      postalComplexName: [employee.postalAddress?.complexName, Validators.required],
      postalStreetNumber: [employee.postalAddress?.streetNumber, Validators.required],
      postalSuburb: [employee.postalAddress?.suburbOrDistrict, Validators.required],
      postalCity: [employee.postalAddress?.city, Validators.required],
      postalCountry: [employee.postalAddress?.country, Validators.required],
      postalProvince: [employee.postalAddress?.province, Validators.required],
      postalPostalCode: [employee.postalAddress?.postalCode, Validators.required]
    });
    this.addressDetailsForm.disable();
  }

  checkEmployeeDetails() {
    this.panelOpenState = true;
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
  }

  savePersonalEdit() {
    this.editPersonal = false;
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
            error: (error: any) => {
              this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' });
            },
          });
        },
        error: (error: any) => { this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' }); },
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

  initializeEmployeeProfileDto() {
    this.employeeProfileDto = {
      id: this.employeeProfile.id,
      employeeNumber: this.employeeProfile.employeeNumber,
      taxNumber: this.employeeProfile.taxNumber,
      engagementDate: this.employeeProfile.engagementDate,
      terminationDate: this.employeeProfile.terminationDate,
      peopleChampion: this.employeeProfile.peopleChampion,
      disability: this.employeeProfile.disability,
      disabilityNotes: this.employeeProfile.disabilityNotes,
      countryOfBirth: this.employeeProfile.countryOfBirth,
      nationality: this.employeeProfile.nationality,
      level: this.employeeProfile.level,
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
      clientAllocated: this.employeeProfile.clientAllocated,
      teamLead: this.employeeProfile.teamLead,
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
      this.employeeProfileDto.clientAllocated = this.clientId == 0 ? null : this.clientId;
      this.employeeProfileDto.employeeType.id = this.employeeType !== null ? this.employeeType?.id : this.employeeProfile.employeeType.id;
      this.employeeProfileDto.employeeType.name = this.employeeType !== null ? this.employeeType?.name : this.employeeProfile.employeeType.name;
      this.employeeProfileDto.level = employeeDetailsForm.level;
      this.employeeProfileDto.teamLead = this.employeeId == 0 ? null : this.employeeId;
      this.employeeProfileDto.peopleChampion = this.peopleChampionId == 0 ? null : this.peopleChampionId;
      this.employeeProfileDto.dateOfBirth = employeeDetailsForm.dateOfBirth;
      this.employeeProfileDto.idNumber = employeeDetailsForm.idNumber;
      this.employeeProfileDto.engagementDate = employeeDetailsForm.engagementDate;

      this.employeeService.updateEmployee(this.employeeProfileDto).subscribe({
        next: (data) => {
          this.toast.success({ detail: "Employee Details updated!", position: 'topRight' });
          this.employeeDetailsForm.disable();
        },
        error: (error) => { this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' }); },
      });
    }
  }

  cancelEmployeeEdit() {
    this.editEmployee = false;
    this.employeeDetailsForm.reset();
    this.initializeForm(this.selectedEmployee ? this.selectedEmployee : this.employeeProfile);
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
          this.employeeContactForm.disable();
        },
        error: (error) => {this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' }); },
      });
    }
  }

  cancelContactEdit() {
    this.editContact = false;
    this.employeeContactForm.reset();
    this.initializeForm(this.selectedEmployee ? this.selectedEmployee : this.employeeProfile);
    this.employeeContactForm.disable();
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
    }
    else if (name == 'champion') {
      this.peopleChampionId = data.employee.id
    }
  }

}