import { Component, Input } from '@angular/core';
import { Properties } from 'src/app/models/properties.interface';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
import { race } from 'src/app/models/constants/race.constants';
import { gender } from 'src/app/models/constants/gender.constants';
import { countries } from 'src/app/models/constants/country.constants';
import { disabilities } from 'src/app/models/constants/disabilities.constant';
import { provinces } from 'src/app/models/constants/provinces.constants';
import { FieldCode } from 'src/app/models/field-code.interface';
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
import { EmployeeData } from 'src/app/models/employee-data.interface';
import { EmployeeAddressService } from 'src/app/services/employee/employee-address.service';
import { of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeBankingService } from 'src/app/services/employee/employee-banking.service';
import { EmployeeBanking } from 'src/app/models/employee-banking.interface';
import { banks } from 'src/app/models/constants/banks.constants';
import { accountTypes } from 'src/app/models/constants/accountTypes.constants';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeDocument } from 'src/app/models/employeeDocument.interface';
import { EmployeeDocumentService } from 'src/app/services/employee/employee-document.service';
import { Document } from 'src/app/models/constants/documents.contants';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  @Input() selectedEmployee: EmployeeProfile | null = null;
  employeeFields: Properties[] = [];
  editFields: Properties[] = [];
  employeeProfile: EmployeeProfile | null = null;
  employeePhysicalAddress !: EmployeeAddress;
  employeePostalAddress !: EmployeeAddress;
  customFields: FieldCode[] = [];
  clients: Client[] = [];
  employees: EmployeeProfile[] = [];
  employeeTypes: EmployeeType[] = [];
  employeeData: EmployeeData[] = [];
  employeeBanking !: EmployeeBanking;

  employeeProfileDto?: any;
  employeeType?: EmployeeType;
  employeeAddressDto: any;
  employeeBankingDto !: any;

  isEdit: boolean = false;
  selectedItem: string = 'Profile Details';
  expandedIndex = 0;
  panelOpenState: boolean = false;
  hasDisbility: boolean | undefined = false;
  physicalEqualPostal: boolean = false;

  public genders = gender;
  public races = race;
  public levels = level;
  public countries = countries;
  public disabilities = disabilities;
  public provinces = provinces;
  public banks = banks;
  public accountTypes = accountTypes;
  public fileCategories = Document;

  editContact: boolean = false;
  editEmployee: boolean = false;
  editPersonal: boolean = false;
  editAddress: boolean = false;
  editBanking: boolean = false;


  isUpdated: boolean = false;
  physicalCountryControl: string = "";
  postalCountryControl: string = "";

  employeeClient: EmployeeProfile | undefined;
  employeeTeamLead: EmployeeProfile | undefined;
  employeePeopleChampion: EmployeeProfile | undefined;

  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;

  employeeFormProgress: number = 0;
  personalFormProgress: number = 0;
  contactFormProgress: number = 0;
  addressFormProgress: number = 0;
  profileFormProgress: number = 0;
  overallFormProgress: number = 0;
  documentFormProgress: number = 0;
  
  bankingFormProgress: number = 0;

  careerSummaryProgress: number = 0;
  bankInformationProgress: number = 0;
  documentsProgress: number = 0;
  bankingId: number = 0;
  bankingStatus: number = 0;
  bankingReason: string = "" ;

  bankingPDFName: string = "" ;
  hasBankingData: boolean = false;
  hasFile: boolean = false;

  displayedColumns: string[] = ['document', 'action', 'status'];
  dataSource = new MatTableDataSource<string>();
  employeeDocuments : EmployeeDocument[] = [];
  uploadButtonIndex : number= 0;
  base64String : string = "";
  documentsFileName : string = "";

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

  employeeContactForm: FormGroup = this.fb.group({
    email: { value: '', disabled: true },
    personalEmail: { value: '', disabled: true },
    cellphoneNo: { value: '', disabled: true },
    houseNo: { value: '', disabled: true },
    emergencyContactName: { value: '', disabled: true },
    emergencyContactNo: { value: '', disabled: true }
  });

  personalDetailsForm: FormGroup = this.fb.group({
    gender: { value: '', disabled: true },
    race: { value: '', disabled: true },
    disability: { value: '', disabled: true },
    disabilityNotes: { value: '', disabled: true },
    disabilityList: { value: '', disabled: true }
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

  employeeBankingsForm: FormGroup = this.fb.group({
    accountHolderName: [{ value: '', disabled: true }, Validators.required],
    accountType: [{ value: -1, disabled: true }, Validators.required],
    bankName:[{ value: '', disabled: true }, Validators.required],
    accountNo:  [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    branch:[{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    file:[{ value: '', disabled: true }, Validators.required],
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
  employeeDataDto!: EmployeeData;
  filteredCountries: any[] = this.countries.slice();


  constructor(private cookieService: CookieService, private employeeProfileService: EmployeeProfileService,
    private employeeAddressService: EmployeeAddressService,
    private clientService: ClientService,
    private toast: NgToastService,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private employeeTypeService: EmployeeTypeService,
    private employeeBankingService: EmployeeBankingService,
    private employeeDocumentService: EmployeeDocumentService) { }

  ngOnInit() {
    this.getEmployeeFields();
  }

  goToEmployees() {
    this.cookieService.set('currentPage', 'Employees');
  }

  getEmployeeFields() {
    const employeeObservale = this.selectedEmployee ? of(this.selectedEmployee) : this.employeeProfileService.GetEmployeeProfile();
    employeeObservale.subscribe({
      next: data => {
        this.employeeProfile = data;
        this.employeePhysicalAddress = data.physicalAddress!;
        this.employeePostalAddress = data.postalAddress!;
        this.hasDisbility = data.disability;
        this.hasDisbility = this.employeeProfile!.disability;
        this.getEmployeeDocuments();
        this.employeeService.getAllProfiles().subscribe({
          next: data => {
            this.employees = data;
            this.employeeTeamLead = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.teamLead)[0];
            this.employeePeopleChampion = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.peopleChampion)[0];

            this.clientService.getAllClients().subscribe({
              next: data => {
                this.clients = data;
                this.employeeClient = this.clients.filter((client: any) => client.id === this.employeeProfile?.clientAllocated)[0];
              }
            });
          }
        });
        this.employeeTypeService.getAllEmployeeTypes().subscribe({
          next: data => {
            this.employeeTypes = data;
            this.initializeEmployeeProfileDto();
          }
        });
        this.initializeForm(); 
      }
    });
  }

  initializeForm() {
    this.employeeDetailsForm = this.fb.group({
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
    });

    this.personalDetailsForm.disable();
    this.checkPersonalFormProgress();
    this.totalProfileProgress();
    this.checkEmployeeDetails();
  }

  checkEmployeeDetails() {
    this.panelOpenState = true;
    this.foundTeamLead = this.employees.find((data: any) => {
      return data.id == this.employeeProfile!.teamLead
    });
    this.foundClient = this.clients.find((data: any) => {
      return data.id == this.employeeProfile!.clientAllocated
    });
    this.foundChampion = this.employees.find((data: any) => {
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
          this.checkPersonalFormProgress();
          this.totalProfileProgress();
          this.getEmployeeFields();
          this.personalDetailsForm.disable();
        },
        error: (error) => {
          this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' });
        },
      });
    }
    else {
      this.toast.error({ detail: "Error", summary: "Please fill in the required fields", duration: 5000, position: 'topRight' });
    }
  }

  cancelPersonalEdit() {
    this.editPersonal = false;
    this.hasDisbility = false;
    this.initializeForm();
    this.personalDetailsForm.disable();
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
            error: (error: any) => {
              this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' });
            },
          });
        },
        error: (error: any) => { this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' }); },
      });
    }
    else {
      this.toast.error({ detail: "Error", summary: "Please fill in the required fields", duration: 5000, position: 'topRight' });
    }
  }

  cancelAddressEdit() {
    this.editAddress = false;
    this.hasDisbility = false;
    this.initializeForm();
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
          this.employeeClient = this.clients.filter((client: any) => client.id === this.employeeProfileDto?.clientAllocated)[0];
          this.employeeTeamLead = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfileDto?.teamLead)[0];
          this.employeePeopleChampion = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfileDto?.peopleChampion)[0];
          this.employeeDetailsForm.disable();
        },
        error: (error) => { this.toast.error({ detail: "Error", summary: "test"+error, duration: 5000, position: 'topRight' }); },
      });
    }
    else {
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
    else {
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
      this.filteredPeopleChamps = this.employees.filter((champs: any) =>
        champs.employee.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
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
    }
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

  checkPersonalFormProgress() {
    let filledCount = 0;
    let totalFields = 0;
    const formControls = this.personalDetailsForm.controls;

    if (this.hasDisbility) {
      totalFields = (Object.keys(this.personalDetailsForm.controls).length);
    }
    else {
      totalFields = (Object.keys(this.personalDetailsForm.controls).length) - 2;
    }
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '' && this.hasDisbility != false && control.value != "na") {
          filledCount++;
        }
        else if (controlName.includes("disability") && this.hasDisbility == false) {
          filledCount++;
        }
      }
    }
    this.personalFormProgress = Math.round((filledCount / totalFields) * 100);
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
        if (this.physicalEqualPostal && controlName.includes("physical") && control.value != null && control.value != '' && control.value != "TBD") {
          filledCount++;
        }
        else if (!this.physicalEqualPostal && control.value != null && control.value != '' && control.value != "TBD") {
          filledCount++;
        }
      }
    }
    this.addressFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  checkBankingInformationProgress() {
    let filledCount = 0;
    let totalFields = 0;
    const formControls = this.employeeBankingsForm.controls;
    totalFields = (Object.keys(this.employeeBankingsForm.controls).length);
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value !== '') {
          filledCount++;
        }
      }
    }
    this.bankingFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  totalProfileProgress() {
    this.profileFormProgress = Math.floor((this.employeeFormProgress + this.personalFormProgress + this.contactFormProgress + this.addressFormProgress) / 4);
    this.overallProgress();
  }

  totalBankingProgress(){
    this.bankInformationProgress = Math.floor(this.bankingFormProgress);
    this.overallProgress();
  }

  overallProgress() {
    this.overallFormProgress = Math.round((0.25 * this.profileFormProgress) + (0.25 * this.bankInformationProgress));
  }


  openFileInput() {
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    fileInput.click();
  }

  editBankingDetails() {
    this.editBanking = true;
    this.employeeBankingsForm.enable();
  }
  cancelBankingDetails() {
    this.editBanking = false;
    this.employeeBankingsForm.disable();
  }

  saveBankingDetails() {

    this.editBanking = false;
    this.isUpdated = true;
    const employeeBankingFormValue = this.employeeBankingsForm.value;
    this.employeeBankingDto = {
      id: this.bankingId,
      accountHolderName: employeeBankingFormValue.accountHolderName,
      employeeId: this.employeeProfile?.id,
      bankName: employeeBankingFormValue.bankName,
      branch: `${employeeBankingFormValue.branch}`,
      accountNo: `${employeeBankingFormValue.accountNo}`,
      accountType: employeeBankingFormValue.accountType,
      status: 1,
      declineReason: this.bankingReason,
      file: employeeBankingFormValue.file
    }
    if(this.hasBankingData){

      this.employeeBankingService.updatePending(this.employeeBankingDto).subscribe({
        next: () => {
          this.toast.success({ detail: "Employee Banking updated!", position: 'topRight' });
        this.addressDetailsForm.disable();
        this.checkAddressFormProgress();
        this.totalBankingProgress();
        this.getEmployeeFields();
        this.checkBankingInformationProgress();
      },
      error: (error) => {
        this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' });
      }
    })
    }
    else{
      this.employeeBankingService.addBankingDetails(this.employeeBankingDto).subscribe({
        next: () => {
          this.toast.success({ detail: "Banking Details Added!", position: 'topRight' });
          this.addressDetailsForm.disable();
          this.checkAddressFormProgress();
          this.totalBankingProgress();
          this.getEmployeeFields();
          this.checkBankingInformationProgress();
        }
        ,error : (error) => {
          this.toast.error({ detail: "Failed to create banking information", summary: error, duration: 5000, position: 'topRight' });
        }
      })
    }
  }
  convertFileToBase64() {
    if (this.employeeBanking.file)
      this.downloadFile(this.employeeBanking.file, `${this.employeeProfile?.name} ${this.employeeProfile?.surname}_Proof_of_Account.pdf`);
  }

  downloadFile(base64String: string, fileName: string) {
    const commaIndex = base64String.indexOf(',');
    if (commaIndex !== -1) {
      base64String = base64String.slice(commaIndex + 1);
    }

    const byteString = atob(base64String);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  selectedFile !: File;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.bankingPDFName = this.selectedFile.name;
    this.uploadFile();
  }

  uploadFile() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.employeeBankingsForm.patchValue({ 'file': base64String });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  captureUploadIndex(event : any){
    this.uploadButtonIndex = event.srcElement.parentElement.id;
    const inputField = document.getElementById(`${this.uploadButtonIndex}-document`) as HTMLInputElement;
    inputField.click();
  }

  uploadDocument(event: any){
    this.selectedFile = event.target.files[0];
    this.documentsFileName = this.selectedFile.name;
    this.uploadProfileDocument();
  }
  
  uploadProfileDocument(){
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.buildDocumentDto();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

getEmployeeDocuments() {
    this.employeeDocumentService.getAllEmployeeDocuments(this.employeeProfile?.id as number).subscribe({
      next: data => {
        this.employeeDocuments = data;
        this.dataSource.data = this.fileCategories;
        this.calculateDocumentProgress();
        // console.log(this.dataSource.data);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  uploadDocumentDto(document : any){
    if(document.id == 0){
      const saveObj = {
        id: document.id,
        employeeId: document.employee.id,
        fileName: document.fileName,
        file: this.base64String,
        fileCategory: document.fileCategory,
        uploadDate: document.uploadDate
      }
      this.employeeDocumentService.saveEmployeeDocument(saveObj).subscribe({
        next: () => {
          this.toast.success({ detail: "Document added!", position: 'topRight' });
          this.getEmployeeDocuments();
          this.calculateDocumentProgress();
        },
        error: () => {
          this.toast.error({ detail: "Document unable to upload!", position: 'topRight' });
        }
      });
    }else{
      this.employeeDocumentService.updateEmployeeDocument(document).subscribe({
        next: () => {
          this.toast.success({ detail: "Document updated ", position: 'topRight' });
          this.getEmployeeDocuments();
          this.calculateDocumentProgress();
        },
        error: () => {
          this.toast.error({ detail: "Document unable to update!", position: 'topRight' });
        }
      });
    }
  }
  buildDocumentDto(){
    const existingValue = this.filterDocumentsByCategory();
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64String = reader.result as string;
        var newDto : {} = {
          id: existingValue != undefined ?  existingValue?.id as number : 0,
          employee: this.employeeProfile,
          reference: "",
          fileName: this.documentsFileName,
          fileCategory: +this.uploadButtonIndex,
          blob: this.base64String,
          status: 1,
          uploadDate: new Date(),
          reason: '',
        };
        console.log("buildDocumentDto; "+ newDto);
        this.uploadDocumentDto(newDto);

      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  filterDocumentsByCategory() : EmployeeDocument | null{
    var object  = this.employeeDocuments.filter(document => document.fileCategory == this.uploadButtonIndex);
    if(object == null){
      return null;
    }
    return object[0];
  }

  getFileName(index : number) : EmployeeDocument{
    var docObj = this.employeeDocuments.find(document => document.fileCategory == index) as EmployeeDocument;
    return docObj;
  }

  downloadDocument(event: any){
    const id = event.srcElement.parentElement.id;
    const docObj = this.employeeDocuments.find(document => document.fileCategory == id) as any;
    if(docObj === undefined){
      // ToDo: download clean slate form
    }
    else{
      if(docObj.status == 2){
          // ToDo: download clean slate form
      }else{
        this.downloadFile(docObj?.blob as string, docObj?.fileName as string);
      }
    }
  }
  
  disableButton(index: number):boolean{
    const docObj = this.employeeDocuments.find(document => document.fileCategory == index);
    if(docObj == undefined || docObj?.status == 2){
      return false;
    }
    return true;
  }

  calculateDocumentProgress(){
    const total = this.fileCategories.length;
    const fetchedDocuments = this.employeeDocuments.length;
    this.documentFormProgress = Math.floor( fetchedDocuments/total);
  }
}
