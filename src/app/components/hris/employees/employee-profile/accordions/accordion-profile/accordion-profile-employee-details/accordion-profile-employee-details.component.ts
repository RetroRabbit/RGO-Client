import { Component, HostListener, Input } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { CustomvalidationService } from 'src/app/services/hris/idnumber-validator';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { ClientService } from 'src/app/services/hris/client.service';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { CustomFieldService } from 'src/app/services/hris/field-code.service';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-accordion-profile-employee-details',
  templateUrl: './accordion-profile-employee-details.component.html',
  styleUrls: ['./accordion-profile-employee-details.component.css']
})
export class AccordionProfileEmployeeDetailsComponent {

  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  usingProfile: boolean = true;

  onResize() {
    this.screenWidth = window.innerWidth;
  }
  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  employeeFormProgress: number = 0;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    private customValidationService: CustomvalidationService,
    private employeeProfileService: EmployeeProfileService,
    private employeeDataService: EmployeeDataService,
    private clientService: ClientService,
    private employeeTypeService: EmployeeTypeService,
    private customFieldService: CustomFieldService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private navService: NavService) {
  }

  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeForm();
    this.initializeEmployeeProfileDto();
    this.getEmployeeFields();
    this.getClients();
    this.checkEmployeeDetails();
  }

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
    this.sharedAccordionFunctionality.checkEmployeeFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeDetailsForm.controls), "Employee", true)

    this.sharedAccordionFunctionality.personalDetailsForm = this.fb.group({
      gender: [this.employeeProfile!.employeeDetails.gender, Validators.required],
      race: [this.employeeProfile!.employeeDetails.race, Validators.required],
      disability: [this.employeeProfile!.employeeDetails.disability, Validators.required],
      disabilityList: "",
      disabilityNotes: [this.employeeProfile!.employeeDetails.disabilityNotes]
    });
  }

  initializeEmployeeProfileDto() {
    this.sharedAccordionFunctionality.employeeProfileDto = {
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

  saveEmployeeEdit() {
    if (this.sharedAccordionFunctionality.employeeDetailsForm.valid) {
      const employeeDetailsForm = this.sharedAccordionFunctionality.employeeDetailsForm.value;
      const personalDetailsForm = this.sharedAccordionFunctionality.personalDetailsForm.value;
      this.sharedAccordionFunctionality.employeeType = this.sharedAccordionFunctionality.employeeTypes.find((data: any) => {
        return data.name == employeeDetailsForm.employeeType
      });

      this.sharedAccordionFunctionality.employeeProfileDto.name = employeeDetailsForm.name;
      this.sharedAccordionFunctionality.employeeProfileDto.surname = employeeDetailsForm.surname;
      this.sharedAccordionFunctionality.employeeProfileDto.initials = employeeDetailsForm.initials;
      this.sharedAccordionFunctionality.employeeProfileDto.clientAllocated = this.sharedAccordionFunctionality.employeeDetailsForm.controls["clientAllocated"].value == "" ? null : this.sharedAccordionFunctionality.clientId;
      this.sharedAccordionFunctionality.employeeProfileDto.employeeType.id = this.sharedAccordionFunctionality.employeeType !== null ? this.sharedAccordionFunctionality.employeeType?.id : this.employeeProfile!.employeeDetails.employeeType!.id;
      this.sharedAccordionFunctionality.employeeProfileDto.employeeType.name = this.sharedAccordionFunctionality.employeeType !== null ? this.sharedAccordionFunctionality.employeeType?.name : this.employeeProfile!.employeeDetails.employeeType!.name;
      this.sharedAccordionFunctionality.employeeProfileDto.level = employeeDetailsForm.level;
      this.sharedAccordionFunctionality.employeeProfileDto.teamLead = this.sharedAccordionFunctionality.employeeDetailsForm.controls["teamLead"].value == 0 ? null : this.employeeProfile.employeeDetails.teamLead;
      this.sharedAccordionFunctionality.employeeProfileDto.peopleChampion = this.sharedAccordionFunctionality.employeeDetailsForm.controls["peopleChampion"].value == "" ? null : this.sharedAccordionFunctionality.peopleChampionId
      this.sharedAccordionFunctionality.employeeProfileDto.dateOfBirth = this.sharedAccordionFunctionality.employeeDetailsForm.value.dateOfBirth;
      this.sharedAccordionFunctionality.employeeProfileDto.idNumber = employeeDetailsForm.idNumber;
      this.sharedAccordionFunctionality.employeeProfileDto.engagementDate = new Date(
        new Date(this.sharedAccordionFunctionality.employeeDetailsForm.value.engagementDate!)
          .setUTCHours(0, 0, 0, 0)
        + 24 * 60 * 60 * 1000
      ).toISOString();
      this.sharedAccordionFunctionality.employeeProfileDto.gender = personalDetailsForm.gender;
      this.employeeService.updateEmployee(this.sharedAccordionFunctionality.employeeProfileDto).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Employee details updated", "snack-success");
          this.sharedAccordionFunctionality.checkEmployeeFormProgress();
          this.sharedAccordionFunctionality.totalProfileProgress();
          this.sharedAccordionFunctionality.employeeClient = this.sharedAccordionFunctionality.clients.filter((client: any) => client.id === this.sharedAccordionFunctionality.employeeProfileDto?.clientAllocated)[0];
          this.sharedAccordionFunctionality.employeeTeamLead = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.sharedAccordionFunctionality.employeeProfileDto?.teamLead)[0];
          this.sharedAccordionFunctionality.employeePeopleChampion = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.sharedAccordionFunctionality.employeeProfileDto?.peopleChampion)[0];
          this.sharedAccordionFunctionality.editEmployee = false;
          this.sharedAccordionFunctionality.employeeDetailsForm.disable();
          this.navService.refreshEmployee();
        },
      });
    }
    else {
      this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
    }
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
  }

  filterClients(event: any) {
    if (event) {
      this.sharedAccordionFunctionality.filteredClients = this.sharedAccordionFunctionality.clients.filter((client: { name: string; }) =>
        client.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
    } else {
      this.sharedAccordionFunctionality.filteredClients = this.sharedAccordionFunctionality.clients;
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
        this.sharedAccordionFunctionality.clientId = data.id;
        break;
      case 'champion':
        this.sharedAccordionFunctionality.peopleChampionId = data.id;
        break;
    }
  }

  filterEmployees(event: any) {
    if (event) {
      this.sharedAccordionFunctionality.filteredEmployees = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) =>
        employee.name!.toLowerCase().includes(event.target.value.toLowerCase())
      );
    } else {
      this.sharedAccordionFunctionality.filteredEmployees = this.sharedAccordionFunctionality.employees;
    }
  }

  filterChampions(event: any) {
    if (event) {
      this.sharedAccordionFunctionality.filteredPeopleChamps = this.sharedAccordionFunctionality.employees.filter((champs: EmployeeProfile) =>
        champs.employeeType?.id == 7 && champs.name?.toLowerCase().includes(event.target.value.toLowerCase())
      );
    } else {
      this.sharedAccordionFunctionality.filteredPeopleChamps = this.sharedAccordionFunctionality.employees;
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
      this.sharedAccordionFunctionality.employeeDetailsForm.patchValue({
        dateOfBirth: new Date(Date.UTC(parseInt(birthYear), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0))
          .toISOString()
      });
    }
    if (gender) {
      gender > 4999 ? this.sharedAccordionFunctionality.employeeDetailsForm.patchValue({ gender: 1 }) : this.sharedAccordionFunctionality.employeeDetailsForm.patchValue({ gender: 2 })
    }
  }

  editEmployeeDetails() {
    this.sharedAccordionFunctionality.employeeDetailsForm.enable();
    this.sharedAccordionFunctionality.editEmployee = true;
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeDetailsForm.controls), "Employee", false)
  }

  cancelEmployeeEdit() {
    this.sharedAccordionFunctionality.editEmployee = false;
    this.initializeForm();
    this.sharedAccordionFunctionality.employeeDetailsForm.disable();
  }

  getEmployeeFields() {
    this.sharedAccordionFunctionality.hasDisability = this.employeeProfile.employeeDetails.disability;
    this.sharedAccordionFunctionality.hasDisability = this.employeeProfile!.employeeDetails.disability;
    this.sharedAccordionFunctionality.hasDisability = this.employeeProfile.employeeDetails.disability;
    this.sharedAccordionFunctionality.hasDisability = this.employeeProfile!.employeeDetails.disability;
    this.getEmployeeData();
    this.getEmployeeTypes();
    if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin()) {
      this.getAllEmployees();
    }
    this.getEmployeeFieldCodes();
    this.initializeForm();
    if (!this.authAccessService.isEmployee()) {
      this.employeeProfileService.getEmployeeById(this.employeeProfile.employeeDetails.id as number).subscribe({
        next: data => {
          this.employeeProfile.employeeDetails = data;
          this.sharedAccordionFunctionality.employeePhysicalAddress = data.physicalAddress!;
          this.sharedAccordionFunctionality.employeePostalAddress = data.postalAddress!;
          this.sharedAccordionFunctionality.hasDisability = data.disability;
          this.sharedAccordionFunctionality.hasDisability = this.employeeProfile!.employeeDetails.disability;
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
        this.sharedAccordionFunctionality.employeeData = data;
      }
    });
  }

  getAllEmployees() {
    this.employeeService.getEmployeeProfiles().subscribe({
      next: data => {
        this.sharedAccordionFunctionality.employees = data;
        this.sharedAccordionFunctionality.employeeTeamLead = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.teamLead)[0];
        this.sharedAccordionFunctionality.employeePeopleChampion = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.peopleChampion)[0];
        this.clientService.getAllClients().subscribe({
          next: data => {
            this.sharedAccordionFunctionality.clients = data;
            this.sharedAccordionFunctionality.employeeClient = this.sharedAccordionFunctionality.clients.filter((client: any) => client.id === this.employeeProfile?.employeeDetails.clientAllocated)[0];
          }
        });
      }
    });
  }

  getClients() {
    this.clientService.getAllClients().subscribe({
      next: data => this.sharedAccordionFunctionality.clients = data
    })
  }

  getEmployeeClient(clientId: string) {
    this.sharedAccordionFunctionality.employeeClient = this.sharedAccordionFunctionality.clients.filter((client: any) => client.id === this.employeeProfile?.employeeDetails.clientAllocated)[0];
  }

  getEmployeeTypes() {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: data => {
        this.sharedAccordionFunctionality.employeeTypes = data;
        this.initializeEmployeeProfileDto();
      }
    });
  }

  getEmployeeFieldCodes() {
    this.customFieldService.getAllFieldCodes().subscribe({
      next: data => {
        this.sharedAccordionFunctionality.customFields = data.filter((data: CustomField) => data.category === this.sharedAccordionFunctionality.category[0].id);
      }
    })
  }

  setHasDisability(event: any) {
    this.sharedAccordionFunctionality.hasDisability = event.value;
  }

  toggleEqualFields() {
    this.sharedAccordionFunctionality.physicalEqualPostal = !this.sharedAccordionFunctionality.physicalEqualPostal;
  }
  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.sharedAccordionFunctionality.employeeContactForm.get(fieldName);

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
