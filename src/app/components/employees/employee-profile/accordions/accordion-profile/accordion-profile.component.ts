import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Client } from 'src/app/models/client.interface';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { levels } from 'src/app/models/constants/levels.constants';
import { races } from 'src/app/models/constants/races.constants';
import { genders } from 'src/app/models/constants/genders.constants';
import { countries } from 'src/app/models/constants/countries.constants';
import { disabilities } from 'src/app/models/constants/disabilities.constant';
import { provinces } from 'src/app/models/constants/provinces.constants';
import { CustomvalidationService } from 'src/app/services/idnumber-validator';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
import { EmployeeAddress } from 'src/app/models/employee-address.interface';
import { EmployeeDataService } from 'src/app/services/employee/employee-data.service';
import { EmployeeData } from 'src/app/models/employee-data.interface';
import { ClientService } from 'src/app/services/client.service';
import { EmployeeTypeService } from 'src/app/services/employee/employee-type.service';
import { FieldCodeService } from 'src/app/services/field-code.service';
import { FieldCode } from 'src/app/models/field-code.interface';
import { category } from 'src/app/models/constants/fieldcodeCategory.constants';
import { EmployeeAddressService } from 'src/app/services/employee/employee-address.service';
import { dataTypes } from 'src/app/models/constants/types.constants';
import { SimpleEmployee } from 'src/app/models/simple-employee-profile.interface';
import { AuthAccessService } from 'src/app/services/auth-access.service';

@Component({
  selector: 'app-accordion-profile',
  templateUrl: './accordion-profile.component.html',
  styleUrls: ['./accordion-profile.component.css']
})
export class AccordionProfileComponent {

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
    public authAccessService: AuthAccessService) {
  }

  usingProfile: boolean = true;

  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeForm();
    this.initializeEmployeeProfileDto();
    this.getEmployeeFields();
    this.getClients();
    this.checkEmployeeDetails();
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

    this.employeeContactForm = this.fb.group({
      email: [this.employeeProfile!.employeeDetails.email, [Validators.required, Validators.pattern(this.emailPattern)]],
      personalEmail: [this.employeeProfile!.employeeDetails.personalEmail, [Validators.required, Validators.email, Validators.pattern("[^_\\W\\s@][\\w.!]*[\\w]*[@][\\w]*[.][\\w.]*")]],
      cellphoneNo: [this.employeeProfile!.employeeDetails.cellphoneNo, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      houseNo: [this.employeeProfile!.employeeDetails.houseNo, [Validators.required, Validators.minLength(4), Validators.pattern(/^[0-9]*$/)]],
      emergencyContactName: [this.employeeProfile!.employeeDetails.emergencyContactName, [Validators.required, Validators.pattern(this.namePattern)]],
      emergencyContactNo: [this.employeeProfile!.employeeDetails.emergencyContactNo, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(10)]]
    });
    this.employeeContactForm.disable();
    this.checkContactFormProgress();

    this.addressDetailsForm = this.fb.group({
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
    this.addressDetailsForm.disable();
    this.checkAddressFormProgress();

    this.personalDetailsForm = this.fb.group({
      gender: [this.employeeProfile!.employeeDetails.gender, Validators.required],
      race: [this.employeeProfile!.employeeDetails.race, Validators.required],
      disability: [this.employeeProfile!.employeeDetails.disability, Validators.required],
      disabilityList: "",
      disabilityNotes: [this.employeeProfile!.employeeDetails.disabilityNotes]
    });

    this.personalDetailsForm.disable();
    this.checkPersonalFormProgress();
    this.totalProfileProgress();
    this.checkEmployeeDetails();
  }

  checkEmployeeDetails() {
    
    if(this.usingProfile)
      this.checkEmployeeDetailsUsingEmployeeProfile()
    else
      this.checkEmployeeDetailsNotUsingEmployeeProfile()
  }
  
  checkEmployeeDetailsUsingEmployeeProfile(){
    this.foundTeamLead = this.employees.find((data: any) => {
      return data.id == this.employeeProfile!.employeeDetails.teamLead
    });
    this.foundClient = this.clients.find((data: any) => {
      return data.id == this.employeeProfile!.employeeDetails.clientAllocated
    });
    this.foundChampion = this.employees.find((data: any) => {
      if (this.employeeProfile?.employeeDetails.peopleChampion != null) {
        return data.id == this.employeeProfile!.employeeDetails.peopleChampion
      }
      else return null;
    });
    
    if (this.foundTeamLead != null) {
      this.employeeDetailsForm.get('teamLead')?.setValue(this.foundTeamLead.name + ' ' + this.foundTeamLead.surname);
      this.employeeProfile.employeeDetails.id = this.foundTeamLead.id
    }
    
    if (this.foundClient != null) {
      this.employeeDetailsForm.get('clientAllocated')?.setValue(this.foundClient.name);
      this.clientId = this.foundClient.id
    }
    
    if (this.foundChampion != null) {
      this.employeeDetailsForm.get('peopleChampion')?.setValue(this.foundChampion.name + ' ' + this.foundChampion.surname);
      this.peopleChampionId = this.foundChampion.id
    }    
  }
  
  checkEmployeeDetailsNotUsingEmployeeProfile(){
    if(this.employeeProfile.simpleEmployee.teamLeadId !== null){
      this.foundTeamLead = this.employeeProfile.simpleEmployee.teamLeadId;
      this.employeeDetailsForm.get('teamLead')?.setValue(this.employeeProfile.simpleEmployee.teamLeadName);
    }
    if(this.employeeProfile.simpleEmployee.peopleChampionId !== null){
      this.employeeDetailsForm.get('peopleChampion')?.setValue(this.employeeProfile.simpleEmployee.peopleChampionName);
      this.peopleChampionId = this.employeeProfile.simpleEmployee.peopleChampionId as number;
    }
    if(this.employeeProfile.simpleEmployee.clientAllocatedId !== null){
      this.employeeDetailsForm.get('clientAllocated')?.setValue(this.employeeProfile.simpleEmployee.clientAllocatedName);
      this.clientId = this.employeeProfile.simpleEmployee.clientAllocatedId as number;
    }
  }

  saveEmployeeEdit() {
    if (this.employeeDetailsForm.valid) {
      const employeeDetailsForm = this.employeeDetailsForm.value;
      const personalDetailsForm = this.personalDetailsForm.value;
      this.employeeType = this.employeeTypes.find((data: any) => {
        return data.name == employeeDetailsForm.employeeType
      });
      this.employeeProfileDto.name = employeeDetailsForm.name;
      this.employeeProfileDto.surname = employeeDetailsForm.surname;
      this.employeeProfileDto.clientAllocated = this.employeeDetailsForm.controls["clientAllocated"].value == "" ? null : this.clientId;
      this.employeeProfileDto.employeeType.id = this.employeeType !== null ? this.employeeType?.id : this.employeeProfile!.employeeDetails.employeeType!.id;
      this.employeeProfileDto.employeeType.name = this.employeeType !== null ? this.employeeType?.name : this.employeeProfile!.employeeDetails.employeeType!.name;
      this.employeeProfileDto.level = employeeDetailsForm.level;
      this.employeeProfileDto.teamLead = this.employeeDetailsForm.controls["teamLead"].value == 0 ? null : this.employeeProfile.employeeDetails.teamLead;
      this.employeeProfileDto.peopleChampion = this.employeeDetailsForm.controls["peopleChampion"].value == "" ? null : this.peopleChampionId
      this.employeeProfileDto.dateOfBirth = this.employeeDetailsForm.value.dateOfBirth;
      this.employeeProfileDto.idNumber = employeeDetailsForm.idNumber;
      this.employeeProfileDto.engagementDate = new Date(
        new Date(this.employeeDetailsForm.value.engagementDate!)
          .setUTCHours(0, 0, 0, 0)
        + 24 * 60 * 60 * 1000
      ).toISOString();
      this.employeeProfileDto.gender = personalDetailsForm.gender;
      this.employeeService.updateEmployee(this.employeeProfileDto).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Employee details updated", "snack-success");
          this.checkEmployeeFormProgress();
          this.totalProfileProgress();
          this.employeeClient = this.clients.filter((client: any) => client.id === this.employeeProfileDto?.clientAllocated)[0];
          this.employeeTeamLead = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfileDto?.teamLead)[0];
          this.employeePeopleChampion = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfileDto?.peopleChampion)[0];
          this.editEmployee = false;
          this.employeeDetailsForm.disable();
        },
        error: (error) => { this.snackBarService.showSnackbar(error.error, "snack-error") },
      });
    }
    else {
      this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
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

  totalProfileProgress() {
    this.profileFormProgress = Math.floor((this.employeeFormProgress + this.personalFormProgress + this.contactFormProgress + this.addressFormProgress + this.additionalFormProgress) / 5);
    this.updateProfile.emit(this.profileFormProgress);
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

  getId(data: any, name: string) {
    switch (name) {
      case 'teamLead':
        this.employeeProfile.employeeDetails.teamLead = data.id;
        break;
      case 'employee':
        this.employeeProfile.employeeDetails.id = data.id;
        break;
      case 'client':
        this.clientId = data.id;
        break;
      case 'champion':
        this.peopleChampionId = data.id;
        break;
    }
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

  filterChampions(event: any) {
    if (event) {
      this.filteredPeopleChamps = this.employees.filter((champs: EmployeeProfile) =>
        champs.employeeType?.id == 7 && champs.name?.toLowerCase().includes(event.target.value.toLowerCase())
      );
    } else {
      this.filteredPeopleChamps = this.employees;
    }
  }

  getGenderBirthday(event: FocusEvent) {
    let idNo = (event.target as HTMLInputElement).value;
    let dob = idNo.slice(0, 6);
    let gender = parseInt(idNo.slice(6, 10));

    let dobMatch = dob.match(/\d{2}/g)
    if (dobMatch) {
      let [year, month, day] = dobMatch;
      const currentYear = new Date().getFullYear().toString().slice(0, 2);
      let birthYear = (parseInt(year) < parseInt(currentYear)) ? ('20' + year) : ('19' + year);
      this.employeeDetailsForm.patchValue({
        dateOfBirth: new Date(Date.UTC(parseInt(birthYear), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0))
          .toISOString()
      });
    }
    if (gender) {
      gender > 4999 ? this.employeeDetailsForm.patchValue({ gender: 1 }) : this.employeeDetailsForm.patchValue({ gender: 2 })
    }
  }

  editEmployeeDetails() {
    this.employeeDetailsForm.enable();
    this.editEmployee = true;
  }

  cancelEmployeeEdit() {
    this.editEmployee = false;
    this.initializeForm();
    this.employeeDetailsForm.disable();
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

  savePersonalEdit() {
    if (this.personalDetailsForm.valid) {
      const personalDetailsFormValue = this.personalDetailsForm.value;
      this.employeeProfileDto.disability = personalDetailsFormValue.disability;
      this.employeeProfileDto.disabilityNotes = personalDetailsFormValue.disabilityNotes;
      this.employeeProfileDto.race = personalDetailsFormValue.race;
      this.employeeProfileDto.gender = personalDetailsFormValue.gender;
      this.employeeService.updateEmployee(this.employeeProfileDto).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Personal details updated", "snack-success");
          this.checkPersonalFormProgress();
          this.totalProfileProgress();
          this.personalDetailsForm.disable();
          this.editPersonal = false;
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

  getEmployeeFields() {
    this.employeePhysicalAddress = this.employeeProfile.employeeDetails.physicalAddress!;
    this.employeePostalAddress = this.employeeProfile.employeeDetails.postalAddress!;
    this.hasDisability = this.employeeProfile.employeeDetails.disability;
    this.hasDisability = this.employeeProfile!.employeeDetails.disability;
    this.getEmployeeData();
    this.getEmployeeTypes();
    if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin()) {
      this.getAllEmployees();
    }
    this.getEmployeeFieldCodes();
    this.initializeForm();
    if(!this.authAccessService.isEmployee()){

      this.employeeProfileService.getEmployeeById(this.employeeProfile.employeeDetails.id as number).subscribe({
        next: data => {
          this.employeeProfile.employeeDetails = data;
          this.employeePhysicalAddress = data.physicalAddress!;
          this.employeePostalAddress = data.postalAddress!;
          this.hasDisability = data.disability;
          this.hasDisability = this.employeeProfile!.employeeDetails.disability;
        }, complete: () => {
          this.getEmployeeData();
          this.getEmployeeTypes();
          if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin() || this.authAccessService.isJourney() || this.authAccessService.isTalent()) {
            this.getAllEmployees();
          }
        this.getEmployeeFieldCodes();
        this.initializeForm();
      }, error: () => {
        this.snackBarService.showSnackbar("Error fetching user profile", "snack-error");
      }
    })
  }
  }

  getEmployeeData() {
    this.employeeDataService.getEmployeeData(this.employeeProfile.employeeDetails.id).subscribe({
      next: data => {
        this.employeeData = data;
      }
    });
  }

  getAllEmployees() {
    this.employeeService.getAllProfiles().subscribe({
      next: data => {
        this.employees = data;
        this.employeeTeamLead = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.teamLead)[0];
        this.employeePeopleChampion = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.peopleChampion)[0];
        this.clientService.getAllClients().subscribe({
          next: data => {
            this.clients = data;
            this.employeeClient = this.clients.filter((client: any) => client.id === this.employeeProfile?.employeeDetails.clientAllocated)[0];
          }
        });
      }
    });
  }

  getClients() {
    this.clientService.getAllClients().subscribe({
      next: data => this.clients = data
    })
  }

  getEmployeeClient(clientId: string) {
    this.employeeClient = this.clients.filter((client: any) => client.id === this.employeeProfile?.employeeDetails.clientAllocated)[0];
  }

  getEmployeeTypes() {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: data => {
        this.employeeTypes = data;
        this.initializeEmployeeProfileDto();
      }
    });
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
        this.customFields = data.filter((data: FieldCode) => data.category === this.category[0].id)
        this.checkAdditionalInformation();
        this.checkAdditionalFormProgress();
        this.totalProfileProgress();
      }
    })
  }

  checkAdditionalInformation() {
    const formGroupConfig: any = {};
    this.customFields.forEach(fieldName => {
      if (fieldName.code != null || fieldName.code != undefined) {
        const customData = this.employeeData.filter((data: EmployeeData) => data.fieldCodeId === fieldName.id)
        formGroupConfig[fieldName.code] = new FormControl({ value: customData[0] ? customData[0].value : '', disabled: true });
        this.additionalInfoForm = this.fb.group(formGroupConfig);
        this.additionalInfoForm.disable();
      }
    });
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

  setHasDisability(event: any) {
    this.hasDisability = event.value;
  }

  editPersonalDetails() {
    this.editPersonal = true;
    this.personalDetailsForm.enable();
  }

  cancelPersonalEdit() {
    this.editPersonal = false;
    this.hasDisability = false;
    this.initializeForm();
    this.personalDetailsForm.disable();
  }

  editContactDetails() {
    this.employeeContactForm.enable();
    this.editContact = true;
  }

  cancelContactEdit() {
    this.editContact = false;
    this.initializeForm();
    this.employeeContactForm.disable();
  }

  saveContactEdit() {
    if (this.employeeContactForm.valid) {
      const employeeContactFormValues = this.employeeContactForm.value;

      this.employeeProfileDto.personalEmail = employeeContactFormValues.personalEmail;
      this.employeeProfileDto.email = employeeContactFormValues.email;
      this.employeeProfileDto.cellphoneNo = employeeContactFormValues.cellphoneNo;
      this.employeeProfileDto.emergencyContactName = employeeContactFormValues.emergencyContactName;
      this.employeeProfileDto.emergencyContactNo = employeeContactFormValues.emergencyContactNo;
      this.employeeProfileDto.houseNo = employeeContactFormValues.houseNo;

      this.employeeService.updateEmployee(this.employeeProfileDto).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Contact details updated", "snack-success");
          this.checkContactFormProgress();
          this.totalProfileProgress();
          this.employeeContactForm.disable();
          this.editContact = false;
        },
        error: (error) => { this.snackBarService.showSnackbar(error.error, "snack-error") },
      });
    }
    else {
      this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
    }
  }

  toggleEqualFields() {
    this.physicalEqualPostal = !this.physicalEqualPostal;
  }

  editAddressDetails() {
    this.editAddress = true;
    this.addressDetailsForm.enable();
  }

  cancelAddressEdit() {
    this.editAddress = false;
    this.hasDisability = false;
    this.initializeForm();
    this.addressDetailsForm.disable();
  }
  saveAddressEdit() {
    if (this.physicalEqualPostal) {
      this.addressDetailsForm.patchValue({
        postalUnitNumber: this.addressDetailsForm.get('physicalUnitNumber')?.value,
        postalComplexName: this.addressDetailsForm.get('physicalComplexName')?.value,
        postalStreetNumber: this.addressDetailsForm.get('physicalStreetNumber')?.value,
        postalSuburb: this.addressDetailsForm.get('physicalSuburb')?.value,
        postalCity: this.addressDetailsForm.get('physicalCity')?.value,
        postalCountry: this.addressDetailsForm.get('physicalCountry')?.value,
        postalProvince: this.addressDetailsForm.get('physicalProvince')?.value,
        postalPostalCode: this.addressDetailsForm.get('physicalPostalCode')?.value
      });
    }

    if (this.addressDetailsForm.valid) {
      const addressDetailFormValue = this.addressDetailsForm.value;

      const physicalAddressDto: EmployeeAddress = {
        id: this.employeeProfile!.employeeDetails.physicalAddress?.id!,
        unitNumber: addressDetailFormValue['physicalUnitNumber'],
        complexName: addressDetailFormValue['physicalComplexName'],
        streetNumber: addressDetailFormValue['physicalStreetNumber'],
        suburbOrDistrict: addressDetailFormValue['physicalSuburb'],
        city: addressDetailFormValue['physicalCity'],
        country: addressDetailFormValue['physicalCountry'],
        province: addressDetailFormValue['physicalProvince'],
        postalCode: addressDetailFormValue['physicalPostalCode'],
      };

      const postalAddressDto: EmployeeAddress = {
        id: this.employeeProfile!.employeeDetails.postalAddress?.id!,
        unitNumber: this.physicalEqualPostal ? addressDetailFormValue['physicalUnitNumber'] : addressDetailFormValue['postalUnitNumber'],
        complexName: this.physicalEqualPostal ? addressDetailFormValue['physicalComplexName'] : addressDetailFormValue['postalComplexName'],
        streetNumber: this.physicalEqualPostal ? addressDetailFormValue['physicalStreetNumber'] : addressDetailFormValue['postalStreetNumber'],
        suburbOrDistrict: this.physicalEqualPostal ? addressDetailFormValue['physicalSuburb'] : addressDetailFormValue['postalSuburb'],
        city: this.physicalEqualPostal ? addressDetailFormValue['physicalCity'] : addressDetailFormValue['postalCity'],
        country: this.physicalEqualPostal ? addressDetailFormValue['physicalCountry'] : addressDetailFormValue['postalCountry'],
        province: this.physicalEqualPostal ? addressDetailFormValue['physicalProvince'] : addressDetailFormValue['postalProvince'],
        postalCode: this.physicalEqualPostal ? addressDetailFormValue['physicalPostalCode'] : addressDetailFormValue['postalPostalCode'],
      };
      this.employeeAddressService.update(postalAddressDto).subscribe({
        next: (postalData) => {
          this.employeeProfile!.employeeDetails.postalAddress = postalAddressDto;
          this.snackBarService.showSnackbar("Postal Details updated", "snack-success");
          this.employeeAddressService.update(physicalAddressDto).subscribe({
            next: (data) => {
              this.employeeProfile!.employeeDetails.physicalAddress = physicalAddressDto;
              this.snackBarService.showSnackbar("Physical address updated", "snack-success");
              this.addressDetailsForm.disable();
              this.checkAddressFormProgress();
              this.totalProfileProgress();
              this.getEmployeeFields();
              this.editAddress = false;
            },
            error: (error: any) => {
              this.snackBarService.showSnackbar(error.error, "snack-error");
            },
          });
        },
        error: (postalError: any) => {
          this.snackBarService.showSnackbar(postalError, "snack-error");
        },
      });
    } else {
      this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
    }
  }

  editAdditionalDetails() {
    this.additionalInfoForm.enable();
    this.editAdditional = true;
  }

  cancelAdditionalEdit() {
    this.editAdditional = false;
    this.initializeForm();
    this.additionalInfoForm.disable();
  }

  saveAdditionalEdit() {
    this.editAdditional = false;
    for (const fieldcode of this.customFields) {
      const found = this.employeeData.find((data) => {
        return fieldcode.id == data.fieldCodeId
      });

      if (found != null) {
        var formatFound: any = fieldcode.code
        const employeeDataDto = {
          id: found.id,
          employeeId: found.employeeId,
          fieldcodeId: found.fieldCodeId,
          value: this.additionalInfoForm.get(formatFound)?.value
        }

        this.employeeDataService.updateEmployeeData(employeeDataDto).subscribe({
          next: (data) => {
            this.snackBarService.showSnackbar("Employee Details updated", "snack-success");
            this.checkAdditionalFormProgress();
            this.totalProfileProgress();
            this.additionalInfoForm.disable();
          },
          error: (error) => { },
        });
      }
      else if (found == null) {
        var formatFound: any = fieldcode?.code
        const employeeDataDto = {
          id: 0,
          employeeId: this.selectedEmployee ? this.selectedEmployee.id : this.employeeProfile?.employeeDetails.id,
          fieldcodeId: fieldcode.id,
          value: this.additionalInfoForm.get(formatFound)?.value
        }

        if (employeeDataDto.value != '') {
          this.employeeDataService.saveEmployeeData(employeeDataDto).subscribe({
            next: (data) => {
              this.snackBarService.showSnackbar("Employee Details updated", "snack-success");
              this.checkAdditionalFormProgress();
              this.totalProfileProgress();
              this.additionalInfoForm.disable();
            },
            error: (error) => {
              this.snackBarService.showSnackbar(error.error, "snack-error");
            }
          });
        }
      }
    }
  }
}
