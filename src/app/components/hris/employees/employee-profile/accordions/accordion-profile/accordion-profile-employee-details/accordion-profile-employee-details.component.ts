import { Component, HostListener, Input } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { CustomvalidationService } from 'src/app/services/hris/id-validator.service';
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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accordion-profile-employee-details',
  templateUrl: './accordion-profile-employee-details.component.html',
  styleUrls: ['./accordion-profile-employee-details.component.css']
})
export class AccordionProfileEmployeeDetailsComponent {

  screenWidth = window.innerWidth;
  existingIdNumber: boolean = false;
  employeeId = this.route.snapshot.params['id'];
  firstName: string = '';
  lastName: string = '';
  initials: string = '';
  idNumber: string = '';
  dateOfBirth: string = '';
  startDate: string = '';
  editEmployee: boolean = false;

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
    private navService: NavService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeForm();
    this.initializeEmployeeProfileDto();
    this.getEmployeeFields();
    this.getClients();
    this.checkEmployeeDetails();
    this.firstName = this.sharedAccordionFunctionality.employeeDetailsForm.get('name')?.value;
    this.lastName = this.sharedAccordionFunctionality.employeeDetailsForm.get('surname')?.value;
    this.idNumber = this.sharedAccordionFunctionality.employeeDetailsForm.get('idNumber')?.value;
    this.dateOfBirth = this.sharedAccordionFunctionality.employeeDetailsForm.get('dateOfBirth')?.value;
    this.startDate = this.sharedAccordionFunctionality.employeeDetailsForm.get('engagementDate')?.value;
  }

  initializeForm() {
    this.sharedAccordionFunctionality.employeeDetailsForm = this.fb.group({
      name: [this.employeeProfile!.employeeDetails.name, [Validators.required,
      Validators.pattern(this.sharedAccordionFunctionality.namePattern)]],
      surname: [this.employeeProfile!.employeeDetails.surname, [Validators.required,
      Validators.pattern(this.sharedAccordionFunctionality.namePattern)]],
      initials: [this.employeeProfile!.employeeDetails.initials, [Validators.pattern(this.sharedAccordionFunctionality.initialsPattern)]],
      clientAllocated: this.usingProfile ? this.employeeProfile!.employeeDetails.clientAllocated : this.employeeProfile!.simpleEmployee.clientAllocatedName,
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

  }

  initializeEmployeeProfileDto() {
    const currentEmployeeId = this.employeeId != undefined ? this.employeeId : this.navService.employeeProfile.id
    this.sharedAccordionFunctionality.employeeProfileDto!.id = currentEmployeeId;
    this.sharedAccordionFunctionality.employeeProfileDto!.employeeNumber = this.employeeProfile!.employeeDetails.employeeNumber;
    this.sharedAccordionFunctionality.employeeProfileDto!.taxNumber = this.employeeProfile!.employeeDetails.taxNumber,
      this.sharedAccordionFunctionality.employeeProfileDto!.engagementDate = this.employeeProfile!.employeeDetails.engagementDate,
      this.sharedAccordionFunctionality.employeeProfileDto!.terminationDate = this.employeeProfile!.employeeDetails.terminationDate,
      this.sharedAccordionFunctionality.employeeProfileDto!.peopleChampion = this.usingProfile ? this.employeeProfile!.employeeDetails.peopleChampion : this.employeeProfile!.simpleEmployee.peopleChampionId,
      this.sharedAccordionFunctionality.employeeProfileDto!.disability = this.employeeProfile!.employeeDetails.disability,
      this.sharedAccordionFunctionality.employeeProfileDto!.disabilityNotes = this.employeeProfile!.employeeDetails.disabilityNotes,
      this.sharedAccordionFunctionality.employeeProfileDto!.countryOfBirth = this.employeeProfile!.employeeDetails.countryOfBirth,
      this.sharedAccordionFunctionality.employeeProfileDto!.nationality = this.employeeProfile!.employeeDetails.nationality,
      this.sharedAccordionFunctionality.employeeProfileDto!.level = this.employeeProfile!.employeeDetails.level,
      this.sharedAccordionFunctionality.employeeProfileDto!.employeeType = {
        id: this.employeeProfile!.employeeDetails.employeeType!.id,
        name: this.employeeProfile!.employeeDetails.employeeType!.name,
      },
      this.sharedAccordionFunctionality.employeeProfileDto!.name = this.employeeProfile!.employeeDetails.name,
      this.sharedAccordionFunctionality.employeeProfileDto!.initials = this.employeeProfile!.employeeDetails.initials,
      this.sharedAccordionFunctionality.employeeProfileDto!.surname = this.employeeProfile!.employeeDetails.surname,
      this.sharedAccordionFunctionality.employeeProfileDto!.dateOfBirth = this.employeeProfile!.employeeDetails.dateOfBirth,
      this.sharedAccordionFunctionality.employeeProfileDto!.idNumber = this.employeeProfile!.employeeDetails.idNumber,
      this.sharedAccordionFunctionality.employeeProfileDto!.passportNumber = this.employeeProfile!.employeeDetails.passportNumber,
      this.sharedAccordionFunctionality.employeeProfileDto!.passportExpirationDate = this.employeeProfile!.employeeDetails.passportExpirationDate,
      this.sharedAccordionFunctionality.employeeProfileDto!.passportCountryIssue = this.employeeProfile!.employeeDetails.passportCountryIssue,
      this.sharedAccordionFunctionality.employeeProfileDto!.race = this.employeeProfile!.employeeDetails.race,
      this.sharedAccordionFunctionality.employeeProfileDto!.gender = this.employeeProfile!.employeeDetails.gender,
      this.sharedAccordionFunctionality.employeeProfileDto!.email = this.employeeProfile!.employeeDetails.email,
      this.sharedAccordionFunctionality.employeeProfileDto!.personalEmail = this.employeeProfile!.employeeDetails.personalEmail,
      this.sharedAccordionFunctionality.employeeProfileDto!.cellphoneNo = this.employeeProfile!.employeeDetails.cellphoneNo,
      this.sharedAccordionFunctionality.employeeProfileDto!.photo = this.employeeProfile!.employeeDetails.photo,
      this.sharedAccordionFunctionality.employeeProfileDto!.notes = '',
      this.sharedAccordionFunctionality.employeeProfileDto!.leaveInterval = this.employeeProfile!.employeeDetails.leaveInterval,
      this.sharedAccordionFunctionality.employeeProfileDto!.salary = this.employeeProfile!.employeeDetails.salary,
      this.sharedAccordionFunctionality.employeeProfileDto!.salaryDays = this.employeeProfile!.employeeDetails.salaryDays,
      this.sharedAccordionFunctionality.employeeProfileDto!.payRate = this.employeeProfile!.employeeDetails.payRate,
      this.sharedAccordionFunctionality.employeeProfileDto!.clientAllocated = this.usingProfile ? this.employeeProfile!.employeeDetails.clientAllocated : this.employeeProfile!.simpleEmployee.clientAllocatedId,
      this.sharedAccordionFunctionality.employeeProfileDto!.teamLead = this.usingProfile ? this.employeeProfile!.employeeDetails.teamLead : this.employeeProfile!.simpleEmployee.teamLeadId,
      this.sharedAccordionFunctionality.employeeProfileDto!.physicalAddress = {
        id: this.employeeProfile!.employeeDetails.physicalAddress?.id!,
        unitNumber: this.employeeProfile!.employeeDetails.physicalAddress?.unitNumber!,
        complexName: this.employeeProfile!.employeeDetails.physicalAddress?.complexName!,
        streetName: this.employeeProfile!.employeeDetails.physicalAddress?.streetName!,
        streetNumber: this.employeeProfile!.employeeDetails.physicalAddress?.streetNumber!,
        suburbOrDistrict: this.employeeProfile!.employeeDetails.physicalAddress?.suburbOrDistrict!,
        city: this.employeeProfile!.employeeDetails.physicalAddress?.city!,
        country: this.employeeProfile!.employeeDetails.physicalAddress?.country!,
        province: this.employeeProfile!.employeeDetails.physicalAddress?.province!,
        postalCode: this.employeeProfile!.employeeDetails.physicalAddress?.postalCode!,
      },
      this.sharedAccordionFunctionality.employeeProfileDto!.postalAddress = {
        id: this.employeeProfile!.employeeDetails.postalAddress?.id!,
        unitNumber: this.employeeProfile!.employeeDetails.postalAddress?.unitNumber!,
        complexName: this.employeeProfile!.employeeDetails.postalAddress?.complexName!,
        streetName: this.employeeProfile!.employeeDetails.postalAddress?.streetName!,
        streetNumber: this.employeeProfile!.employeeDetails.postalAddress?.streetNumber!,
        suburbOrDistrict: this.employeeProfile!.employeeDetails.postalAddress?.suburbOrDistrict!,
        city: this.employeeProfile!.employeeDetails.postalAddress?.city!,
        country: this.employeeProfile!.employeeDetails.postalAddress?.country!,
        province: this.employeeProfile!.employeeDetails.postalAddress?.province!,
        postalCode: this.employeeProfile!.employeeDetails.postalAddress?.postalCode!,
      },
      this.sharedAccordionFunctionality.employeeProfileDto!.houseNo = this.employeeProfile?.employeeDetails.houseNo,
      this.sharedAccordionFunctionality.employeeProfileDto!.emergencyContactName = this.employeeProfile?.employeeDetails.emergencyContactName,
      this.sharedAccordionFunctionality.employeeProfileDto!.emergencyContactNo = this.employeeProfile?.employeeDetails.emergencyContactNo
  }

  isInputEmpty(emailToCheck: string): boolean {
    return emailToCheck === null || emailToCheck.trim() === '';
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
      this.sharedAccordionFunctionality.employeeTeamLead.id = this.sharedAccordionFunctionality.foundTeamLead.id
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
      this.sharedAccordionFunctionality.employeeProfileDto!.name = employeeDetailsForm.name;
      this.sharedAccordionFunctionality.employeeProfileDto!.surname = employeeDetailsForm.surname;
      this.sharedAccordionFunctionality.employeeProfileDto!.initials = employeeDetailsForm.initials;
      this.sharedAccordionFunctionality.employeeProfileDto!.clientAllocated = this.sharedAccordionFunctionality.employeeDetailsForm.controls["clientAllocated"].value == "" ? undefined : this.sharedAccordionFunctionality.clientId;
      this.sharedAccordionFunctionality.employeeProfileDto!.employeeType!.id = this.sharedAccordionFunctionality.employeeType !== null ? this.sharedAccordionFunctionality.employeeType?.id : this.employeeProfile!.employeeDetails.employeeType!.id;
      this.sharedAccordionFunctionality.employeeProfileDto!.employeeType!.name = this.sharedAccordionFunctionality.employeeType !== null ? this.sharedAccordionFunctionality.employeeType?.name : this.employeeProfile!.employeeDetails.employeeType!.name;
      this.sharedAccordionFunctionality.employeeProfileDto!.level = employeeDetailsForm.level;
      this.sharedAccordionFunctionality.employeeProfileDto!.teamLead = this.sharedAccordionFunctionality.employeeDetailsForm.controls["teamLead"].value == 0 ? undefined : this.employeeProfile.employeeDetails.teamLead;
      this.sharedAccordionFunctionality.employeeProfileDto!.peopleChampion = this.sharedAccordionFunctionality.employeeDetailsForm.controls["peopleChampion"].value == "" ? undefined : this.sharedAccordionFunctionality.peopleChampionId
      this.sharedAccordionFunctionality.employeeProfileDto!.dateOfBirth = this.sharedAccordionFunctionality.employeeDetailsForm.value.dateOfBirth;
      this.sharedAccordionFunctionality.employeeProfileDto!.idNumber = employeeDetailsForm.idNumber;
      this.sharedAccordionFunctionality.employeeProfileDto!.engagementDate = new Date(
        new Date(this.sharedAccordionFunctionality.employeeDetailsForm.value.engagementDate!)
          .setUTCHours(0, 0, 0, 0)
        + 24 * 60 * 60 * 1000
      );
      this.sharedAccordionFunctionality.employeeProfileDto!.gender = personalDetailsForm.gender;
      let foundDuplicateId = false;
      this.employeeService.checkDuplicateIdNumber(this.sharedAccordionFunctionality.employeeProfileDto!.idNumber!, this.sharedAccordionFunctionality.employeeProfileDto!.id).subscribe({
        next: (data: boolean) => {
          foundDuplicateId = data;
          if (!foundDuplicateId) {
            this.employeeService.updateEmployee(this.sharedAccordionFunctionality.employeeProfileDto).subscribe({
              next: () => {
                this.snackBarService.showSnackbar("Updated", "snack-success");
                this.sharedAccordionFunctionality.checkEmployeeFormProgress();
                this.sharedAccordionFunctionality.totalProfileProgress();
                this.sharedAccordionFunctionality.employeeClient = this.sharedAccordionFunctionality.clients.filter((client: any) => client.id === this.sharedAccordionFunctionality.employeeProfileDto?.clientAllocated)[0];
                this.sharedAccordionFunctionality.employeeTeamLead = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.sharedAccordionFunctionality.employeeProfileDto?.teamLead)[0];
                this.sharedAccordionFunctionality.employeePeopleChampion = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.sharedAccordionFunctionality.employeeProfileDto?.peopleChampion)[0];
                this.editEmployee = false;
                this.sharedAccordionFunctionality.employeeDetailsForm.disable();
                this.navService.refreshEmployee();
              },
              error: (er) => this.snackBarService.showError(er),
            });
          } else {
            this.snackBarService.showSnackbar("ID Number Already in Use", "snack-error");
          }
        },
      })
    }
    else {
      this.snackBarService.showSnackbar("Some Fields Are Still Missing Information", "snack-error");
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
    this.editEmployee = true;
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeDetailsForm.controls), "Employee", false)
  }

  cancelEmployeeEdit() {
    this.editEmployee = false;
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
        },
        complete: () => {
          this.getEmployeeData();
          this.getEmployeeTypes();
          if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin() || this.authAccessService.isJourney() || this.authAccessService.isTalent()) {
            this.getAllEmployees();
          }
          this.getEmployeeFieldCodes();
          this.initializeForm();
        },
        error: (er) => this.snackBarService.showError(er),
      })
    }
  }

  getEmployeeData() {
    if (this.employeeId != undefined) {
      this.employeeDataService.getEmployeeData(this.employeeId).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.employeeData = data;
        }
      });
    } else {
      this.employeeDataService.getEmployeeData(this.navService.employeeProfile.id).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.employeeData = data;
        }
      });
    }
  }

  getAllEmployees() {
    this.employeeService.getEmployeeProfiles().subscribe({
      next: data => {
        this.sharedAccordionFunctionality.employees = data;
        this.sharedAccordionFunctionality.employeeTeamLead = data.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.teamLead)[0];
        this.sharedAccordionFunctionality.employeePeopleChampion = data.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.peopleChampion)[0];
        this.clientService.getAllClients().subscribe({
          next: data => {
            this.sharedAccordionFunctionality.employeeClient = data.filter((client: any) => client.id === this.employeeProfile?.employeeDetails.clientAllocated)[0];
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
    if (!this.sharedPropertyAccessService.accessProperties) {
      return;
    }
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
