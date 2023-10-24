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
import { Address } from 'src/app/models/address.interface';
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


@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  employeeFields: Properties[] = [];
  editFields: Properties[] = [];
  employeeProfile !: EmployeeProfile;
  employeePhysicalAddress !: Address;
  employeePostalAddress !: Address;
  customFields: FieldCode[] = [];
  employeeRoles: any = [];
  clients: Client[] = [];
  employees: EmployeeProfile[] = [];
  employeeTypes: EmployeeType[] = [];


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
    this.getEmployeeFields();
  }

  getEmployeeFields() {
    this.accessPropertyService.GetAccessProperties(this.cookieService.get('userEmail')).subscribe({
      next: data => {
        this.employeeFields = data;
      }
    });
    this.employeeProfileService.GetEmployeeProfile().subscribe({
      next: data => {
        this.employeeProfile = data;
        // this.employeeAddressService.get(this.employeeProfile.id).subscribe({
        //   next: data => {
        //     this.employeePhysicalAddress = data;
        //   },
        //   error: (error) => {
        //     this.toast.error({detail:"Error",summary: "Failed to fetch address informaion",duration:5000, position:'topRight'});
        //   }
        // })
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

          }
        });
        this.initializeForm();
      }
    });
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
  }

  savePersonalEdit() {
    this.editPersonal = false;
  }

  cancelPersonalEdit() {
    this.editPersonal = false;
    this.hasDisbility = false;
  }

  setPhysicalEqualPostal(event: any) {
    console.log(this.physicalEqualPostal);
  }

  editAddressDetails() {
    this.editAddress = true;
  }

  saveAddressEdit() {
    this.editAddress = false;
  }

  cancelAddressEdit() {
    this.editAddress = false;
    this.hasDisbility = false;
    this.physicalCountryControl = this.postalCountryControl = "";
  }

  editEmployeeDetails() {
    this.employeeDetailsForm.enable();
    this.editEmployee = true;
  }

  saveEmployeeEdit() {
    this.editEmployee = false;
    if (this.employeeDetailsForm.valid) {
      const employeeDetailsForm = this.employeeDetailsForm.value;

      const employeeProfileDto = {
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
          
        }
        postalAddress: 
      }
      this.employeeService.updateEmployee(employeeProfileDto).subscribe({
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
    }
    else if (name == 'champion') {
      this.peopleChampionId = data.employee.id
    }
  }

}