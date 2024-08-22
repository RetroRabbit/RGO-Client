import { Component, HostListener, Input } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { CustomvalidationService } from 'src/app/services/hris/id-validator.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accordion-profile-employee-details',
  templateUrl: './accordion-profile-employee-details.component.html',
  styleUrls: ['./accordion-profile-employee-details.component.css']
})
export class AccordionProfileEmployeeDetailsComponent {

  screenWidth = window.innerWidth;
  existingIdNumber: boolean = false;
  employeeId = this.route.snapshot.params['id'] ?? this.authAccessService.getUserId();
  editEmployee: boolean = false;

  @HostListener('window:resize', ['$event'])

  onResize() {
    this.screenWidth = window.innerWidth;
  }
  @Input() employeeProfile!: { employeeDetails: EmployeeProfile }

  employeeFormProgress: number = 0;

  constructor(
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private customValidationService: CustomvalidationService,
    private employeeProfileService: EmployeeProfileService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.initializeEmployeeProfileDto();
    this.getEmployeeFields();
    this.checkEmployeeDetails();
  }

  initializeForm() {
    this.sharedAccordionFunctionality.employeeDetailsForm = this.fb.group({
      name: [this.employeeProfile!.employeeDetails.name, [Validators.required,
      Validators.pattern(this.sharedAccordionFunctionality.namePattern)]],
      surname: [this.employeeProfile!.employeeDetails.surname, [Validators.required,
      Validators.pattern(this.sharedAccordionFunctionality.namePattern)]],
      initials: [this.employeeProfile!.employeeDetails.initials, [Validators.pattern(this.sharedAccordionFunctionality.initialsPattern)]],
      clientAllocated: this.employeeProfile!.employeeDetails.clientAllocatedName,
      employeeType: this.employeeProfile!.employeeDetails.employeeType!.name,
      level: this.employeeProfile!.employeeDetails.level,
      teamLead: this.employeeProfile!.employeeDetails.teamLeadName,
      dateOfBirth: [this.employeeProfile!.employeeDetails.dateOfBirth, Validators.required],
      idNumber: [this.employeeProfile!.employeeDetails.idNumber, [Validators.required, this.customValidationService.idNumberValidator]],
      engagementDate: [this.employeeProfile!.employeeDetails.engagementDate, Validators.required],
      peopleChampion: this.employeeProfile!.employeeDetails.peopleChampionName
    });
    this.sharedAccordionFunctionality.employeeDetailsForm.disable();
    this.sharedAccordionFunctionality.checkEmployeeFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeDetailsForm.controls), "Employee", true)
  }

  initializeEmployeeProfileDto() {
    const currentEmployeeId = this.employeeId
    this.sharedAccordionFunctionality.employeeProfileDto!.id = currentEmployeeId;
    this.sharedAccordionFunctionality.employeeProfileDto!.employeeNumber = this.employeeProfile!.employeeDetails.employeeNumber;
    this.sharedAccordionFunctionality.employeeProfileDto!.taxNumber = this.employeeProfile!.employeeDetails.taxNumber,
      this.sharedAccordionFunctionality.employeeProfileDto!.engagementDate = this.employeeProfile!.employeeDetails.engagementDate,
      this.sharedAccordionFunctionality.employeeProfileDto!.terminationDate = this.employeeProfile!.employeeDetails.terminationDate,
      this.sharedAccordionFunctionality.employeeProfileDto!.peopleChampionId = this.employeeProfile!.employeeDetails.peopleChampionId,
      this.sharedAccordionFunctionality.employeeProfileDto!.peopleChampionName = this.employeeProfile!.employeeDetails.peopleChampionName,
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
      this.sharedAccordionFunctionality.employeeProfileDto!.clientAllocatedId = this.employeeProfile!.employeeDetails.clientAllocatedId,
      this.sharedAccordionFunctionality.employeeProfileDto!.clientAllocatedName = this.employeeProfile!.employeeDetails.clientAllocatedName,
      this.sharedAccordionFunctionality.employeeProfileDto!.teamLeadId = this.employeeProfile!.employeeDetails.teamLeadId,
      this.sharedAccordionFunctionality.employeeProfileDto!.teamLeadName = this.employeeProfile!.employeeDetails.teamLeadName,
      this.sharedAccordionFunctionality.employeeProfileDto!.houseNo = this.employeeProfile?.employeeDetails.houseNo,
      this.sharedAccordionFunctionality.employeeProfileDto!.emergencyContactName = this.employeeProfile?.employeeDetails.emergencyContactName,
      this.sharedAccordionFunctionality.employeeProfileDto!.emergencyContactNo = this.employeeProfile?.employeeDetails.emergencyContactNo
  }

  checkEmployeeDetails() {
    if (this.employeeProfile.employeeDetails.teamLeadId !== null) {
      this.sharedAccordionFunctionality.foundTeamLead = this.employeeProfile.employeeDetails.teamLeadId;
      this.sharedAccordionFunctionality.employeeDetailsForm.get('teamLead')?.setValue(this.employeeProfile.employeeDetails.teamLeadName);
    }
    if (this.employeeProfile.employeeDetails.peopleChampionId !== null) {
      this.sharedAccordionFunctionality.employeeDetailsForm.get('peopleChampion')?.setValue(this.employeeProfile.employeeDetails.peopleChampionName);
      this.sharedAccordionFunctionality.peopleChampionId = this.employeeProfile.employeeDetails.peopleChampionId as number;
    }
    if (this.employeeProfile.employeeDetails.clientAllocatedId !== null) {
      this.sharedAccordionFunctionality.employeeDetailsForm.get('clientAllocated')?.setValue(this.employeeProfile.employeeDetails.clientAllocatedName);
      this.sharedAccordionFunctionality.clientId = this.employeeProfile.employeeDetails.clientAllocatedId as number;
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
      this.sharedAccordionFunctionality.employeeProfileDto!.clientAllocatedId = this.sharedAccordionFunctionality.employeeDetailsForm.controls["clientAllocated"].value == "" ? undefined : this.employeeProfile.employeeDetails.clientAllocatedId;
      this.sharedAccordionFunctionality.employeeProfileDto!.employeeType!.id = this.sharedAccordionFunctionality.employeeType !== null ? this.sharedAccordionFunctionality.employeeType?.id : this.employeeProfile!.employeeDetails.employeeType!.id;
      this.sharedAccordionFunctionality.employeeProfileDto!.employeeType!.name = this.sharedAccordionFunctionality.employeeType !== null ? this.sharedAccordionFunctionality.employeeType?.name : this.employeeProfile!.employeeDetails.employeeType!.name;
      this.sharedAccordionFunctionality.employeeProfileDto!.level = employeeDetailsForm.level;
      this.sharedAccordionFunctionality.employeeProfileDto!.teamLeadId = this.sharedAccordionFunctionality.employeeDetailsForm.controls["teamLead"].value == 0 ? undefined : this.employeeProfile.employeeDetails.teamLeadId;
      this.sharedAccordionFunctionality.employeeProfileDto!.peopleChampionId = this.sharedAccordionFunctionality.employeeDetailsForm.controls["peopleChampion"].value == "" ? undefined : this.employeeProfile.employeeDetails.peopleChampionId
      this.sharedAccordionFunctionality.employeeProfileDto!.dateOfBirth = this.sharedAccordionFunctionality.employeeDetailsForm.value.dateOfBirth;
      this.sharedAccordionFunctionality.employeeProfileDto!.idNumber = employeeDetailsForm.idNumber;
      this.sharedAccordionFunctionality.employeeProfileDto!.engagementDate = new Date(
        new Date(this.sharedAccordionFunctionality.employeeDetailsForm.value.engagementDate!)
          .setUTCHours(0, 0, 0, 0)
        + 24 * 60 * 60 * 1000
      );
      this.sharedAccordionFunctionality.employeeProfileDto!.gender = personalDetailsForm.gender;
      let foundDuplicateId = false;
      this.employeeProfileService.checkDuplicateIdNumber(this.sharedAccordionFunctionality.employeeProfileDto!.idNumber!, this.sharedAccordionFunctionality.employeeProfileDto!.id).subscribe({
        next: (data: boolean) => {
          foundDuplicateId = data;
          if (!foundDuplicateId) {
            this.employeeProfileService.updateEmployee(this.sharedAccordionFunctionality.employeeProfileDto).subscribe({
              next: () => {
                this.snackBarService.showSnackbar("Updated", "snack-success");
                this.sharedAccordionFunctionality.checkEmployeeFormProgress();
                this.sharedAccordionFunctionality.totalProfileProgress();
                this.sharedAccordionFunctionality.employeeClient = this.sharedAccordionFunctionality.clients.filter((client: any) => client.id === this.sharedAccordionFunctionality.employeeProfileDto?.clientAllocatedId)[0];
                this.sharedAccordionFunctionality.employeeTeamLeadId = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.sharedAccordionFunctionality.employeeProfileDto?.teamLeadId)[0];
                this.sharedAccordionFunctionality.employeePeopleChampionId = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.sharedAccordionFunctionality.employeeProfileDto?.peopleChampionId)[0];
                this.editEmployee = false;
                this.sharedAccordionFunctionality.employeeDetailsForm.disable();
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
        this.employeeProfile.employeeDetails.teamLeadId = data.id;
        break;
      case 'employee':
        this.employeeProfile.employeeDetails.id = data.id;
        break;
      case 'client':
        this.employeeProfile.employeeDetails.id = data.id;
        break;
      case 'champion':
        this.employeeProfile.employeeDetails.id = data.id;
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
    this.initializeEmployeeProfileDto();
    this.getAdditionalEmployeeData();
    this.getEmployeeFieldCodes();
    this.initializeForm();
    
    if (!this.authAccessService.isEmployee()) {
      var data = this.sharedAccordionFunctionality.selectedEmployee;
      this.employeeProfile.employeeDetails = data;
      this.sharedAccordionFunctionality.hasDisability = data.disability;
      this.sharedAccordionFunctionality.hasDisability = this.employeeProfile!.employeeDetails.disability;

      this.initializeEmployeeProfileDto();
      this.getEmployeeFieldCodes();
      this.initializeForm();
    }
  }

  getAdditionalEmployeeData() {
    const data = this.sharedAccordionFunctionality.employees;
    const clientData = this.sharedAccordionFunctionality.clients;
    this.sharedAccordionFunctionality.employeeTeamLeadId = data.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.teamLeadId)[0];
    this.sharedAccordionFunctionality.employeePeopleChampionId = data.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.peopleChampionId)[0];
    this.sharedAccordionFunctionality.employeeClient = clientData.filter((client: any) => client.id === this.employeeProfile?.employeeDetails.clientAllocatedId)[0];
  }

  getEmployeeClient(clientId: string) {
    this.sharedAccordionFunctionality.employeeClient = this.sharedAccordionFunctionality.clients.filter((client: any) => client.id === this.employeeProfile?.employeeDetails.clientAllocatedId)[0];
  }

  getEmployeeFieldCodes() {
    var data = this.sharedAccordionFunctionality.fieldCodes;
    this.sharedAccordionFunctionality.customFields = data.filter((data: CustomField) => data.category === this.sharedAccordionFunctionality.category[0].id);
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
