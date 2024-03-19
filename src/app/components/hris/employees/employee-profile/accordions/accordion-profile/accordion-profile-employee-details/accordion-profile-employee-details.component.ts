import { Component } from '@angular/core';
import { EventEmitter, Input, OnInit, Output, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { ClientService } from 'src/app/services/hris/client.service';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { AccordionProfileComponent } from '../accordion-profile.component';
@Component({
  selector: 'app-accordion-profile-employee-details',
  templateUrl: './accordion-profile-employee-details.component.html',
  styleUrls: ['./accordion-profile-employee-details.component.css']
})
export class AccordionProfileEmployeeDetailsComponent {

  @Output() updateProfile = new EventEmitter<number>();
  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  foundTeamLead: any;
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    private employeeProfileService: EmployeeProfileService,
    private employeeDataService: EmployeeDataService,
    private clientService: ClientService,
    private employeeTypeService: EmployeeTypeService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality
  ) { }

  ngOnInit() {


    this.getClients();

  }

  checkEmployeeDetails() {
    if (this.sharedAccordionFunctionality.usingProfile)
      this.checkEmployeeDetailsUsingEmployeeProfile()
    else
      this.checkEmployeeDetailsNotUsingEmployeeProfile()
  }

  checkEmployeeDetailsUsingEmployeeProfile() {
    this.foundTeamLead = this.sharedAccordionFunctionality.employees.find((data: any) => {
      return data.id == this.employeeProfile!.employeeDetails.teamLead
      //console.log(data.id);
    });
    console.log(this.foundTeamLead)

    this.sharedAccordionFunctionality.foundClient = this.sharedAccordionFunctionality.clients.find((data: any) => {
      return data.id == this.employeeProfile!.employeeDetails.clientAllocated
    });
    this.sharedAccordionFunctionality.foundChampion = this.sharedAccordionFunctionality.employees.find((data: any) => {
      if (this.employeeProfile?.employeeDetails.peopleChampion != null) {
        return data.id == this.employeeProfile!.employeeDetails.peopleChampion
      }
      else return null;
    });

    if (this.foundTeamLead != null) {
      this.sharedAccordionFunctionality.employeeDetailsForm.get('teamLead')?.setValue(this.sharedAccordionFunctionality.foundTeamLead.name + ' ' + this.sharedAccordionFunctionality.foundTeamLead.surname);
      this.employeeProfile.employeeDetails.id = this.foundTeamLead.id
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
    if (this.sharedAccordionFunctionality.employeeProfile.simpleEmployee.teamLeadId !== null) {
      this.foundTeamLead = this.sharedAccordionFunctionality.employeeProfile.simpleEmployee.teamLeadId;
      this.sharedAccordionFunctionality.employeeDetailsForm.get('teamLead')?.setValue(this.sharedAccordionFunctionality.employeeProfile.simpleEmployee.teamLeadName);
    }
    if (this.sharedAccordionFunctionality.employeeProfile.simpleEmployee.peopleChampionId !== null) {
      this.sharedAccordionFunctionality.employeeDetailsForm.get('peopleChampion')?.setValue(this.sharedAccordionFunctionality.employeeProfile.simpleEmployee.peopleChampionName);
      this.sharedAccordionFunctionality.peopleChampionId = this.sharedAccordionFunctionality.employeeProfile.simpleEmployee.peopleChampionId as number;
    }
    if (this.sharedAccordionFunctionality.employeeProfile.simpleEmployee.clientAllocatedId !== null) {
      this.sharedAccordionFunctionality.employeeDetailsForm.get('clientAllocated')?.setValue(this.sharedAccordionFunctionality.employeeProfile.simpleEmployee.clientAllocatedName);
      this.sharedAccordionFunctionality.clientId = this.sharedAccordionFunctionality.employeeProfile.simpleEmployee.clientAllocatedId as number;
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
      this.sharedAccordionFunctionality.employeeProfileDto.employeeType.id = this.sharedAccordionFunctionality.employeeType !== null ? this.sharedAccordionFunctionality.employeeType?.id : this.sharedAccordionFunctionality.employeeProfile!.employeeDetails.employeeType!.id;
      this.sharedAccordionFunctionality.employeeProfileDto.employeeType.name = this.sharedAccordionFunctionality.employeeType !== null ? this.sharedAccordionFunctionality.employeeType?.name : this.sharedAccordionFunctionality.employeeProfile!.employeeDetails.employeeType!.name;
      this.sharedAccordionFunctionality.employeeProfileDto.level = employeeDetailsForm.level;
      this.sharedAccordionFunctionality.employeeProfileDto.teamLead = this.sharedAccordionFunctionality.employeeDetailsForm.controls["teamLead"].value == 0 ? null : this.sharedAccordionFunctionality.employeeProfile.employeeDetails.teamLead;
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
          this.checkEmployeeFormProgress();
          this.sharedAccordionFunctionality.totalProfileProgress();
          this.sharedAccordionFunctionality.employeeClient = this.sharedAccordionFunctionality.clients.filter((client: any) => client.id === this.sharedAccordionFunctionality.employeeProfileDto?.clientAllocated)[0];
          this.sharedAccordionFunctionality.employeeTeamLead = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.sharedAccordionFunctionality.employeeProfileDto?.teamLead)[0];
          this.sharedAccordionFunctionality.employeePeopleChampion = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.sharedAccordionFunctionality.employeeProfileDto?.peopleChampion)[0];
          this.sharedAccordionFunctionality.editEmployee = false;
          this.sharedAccordionFunctionality.employeeDetailsForm.disable();
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
    this.sharedAccordionFunctionality.employeeFormProgress = Math.round((filledCount / totalFields) * 100);
  }
  //emit progress value
  filterClients(event: any) {
    if (event) {
      this.sharedAccordionFunctionality.filteredClients = this.sharedAccordionFunctionality
        .clients.filter((client: { name: string; }) =>
          client.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
    } else {
      this.sharedAccordionFunctionality.filteredClients = this.sharedAccordionFunctionality.clients;
    }
  }

  getId(data: any, name: string) {
    switch (name) {
      case 'teamLead':
        this.sharedAccordionFunctionality.employeeProfile.employeeDetails.teamLead = data.id;
        break;
      case 'employee':
        this.sharedAccordionFunctionality.employeeProfile.employeeDetails.id = data.id;
        break;
      case 'client':
        this.sharedAccordionFunctionality.clientId = data.id;
        break;
      case 'champion':
        this.sharedAccordionFunctionality = data.id;
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
    this.sharedAccordionFunctionality.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeDetailsForm.controls), "Employee", "employeeDetailsForm", false)
  }

  cancelEmployeeEdit() {
    this.sharedAccordionFunctionality.editEmployee = false;
    this.sharedAccordionFunctionality.initializeForm();
    this.sharedAccordionFunctionality.employeeDetailsForm.disable();
  }

  getEmployeeFields() {
    // this.employeePhysicalAddress = this.employeeProfile.employeeDetails.physicalAddress!;
    // this.employeePostalAddress = this.employeeProfile.employeeDetails.postalAddress!;
    // this.sharedAccordionFunctionality.hasDisability = this.sharedAccordionFunctionality.employeeProfile.employeeDetails.disability;
    // this.sharedAccordionFunctionality.hasDisability = this.sharedAccordionFunctionality.employeeProfile!.employeeDetails.disability;
    this.getEmployeeData();
    this.getEmployeeTypes();
    if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin()) {
      this.getAllEmployees();
    }
    this.sharedAccordionFunctionality.getEmployeeFieldCodes();
    this.sharedAccordionFunctionality.initializeForm();
    if (!this.authAccessService.isEmployee()) {

      this.employeeProfileService.getEmployeeById(this.sharedAccordionFunctionality.employeeProfile.employeeDetails.id as number).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.employeeProfile.employeeDetails = data;
          // this.employeePhysicalAddress = data.physicalAddress!;
          // this.employeePostalAddress = data.postalAddress!;
          this.sharedAccordionFunctionality.hasDisability = data.disability;
          this.sharedAccordionFunctionality.hasDisability = this.sharedAccordionFunctionality.employeeProfile!.employeeDetails.disability;
        }, complete: () => {
          this.getEmployeeData();
          this.getEmployeeTypes();
          if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin() || this.authAccessService.isJourney() || this.authAccessService.isTalent()) {
            this.getAllEmployees();
          }
          this.sharedAccordionFunctionality.getEmployeeFieldCodes();
          this.sharedAccordionFunctionality.initializeForm();
        }, error: () => {
          this.snackBarService.showSnackbar("Error fetching user profile", "snack-error");
        }
      })
    }
  }

  getEmployeeData() {
    this.employeeDataService.getEmployeeData(this.sharedAccordionFunctionality.employeeProfile.employeeDetails.id).subscribe({
      next: data => {
        this.sharedAccordionFunctionality.employeeData = data;
      }
    });
  }

  getAllEmployees() {
    this.employeeService.getEmployeeProfiles().subscribe({
      next: data => {
        this.sharedAccordionFunctionality.employees = data;
        this.sharedAccordionFunctionality.employeeTeamLead = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.sharedAccordionFunctionality.employeeProfile?.employeeDetails.teamLead)[0];
        this.sharedAccordionFunctionality.employeePeopleChampion = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === this.sharedAccordionFunctionality.employeeProfile?.employeeDetails.peopleChampion)[0];
        this.clientService.getAllClients().subscribe({
          next: data => {
            this.sharedAccordionFunctionality.clients = data;
            this.sharedAccordionFunctionality.employeeClient = this.sharedAccordionFunctionality.clients.filter((client: any) => client.id === this.sharedAccordionFunctionality.employeeProfile?.employeeDetails.clientAllocated)[0];
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
    this.sharedAccordionFunctionality.employeeClient = this.sharedAccordionFunctionality.clients.filter((client: any) => client.id === this.sharedAccordionFunctionality.employeeProfile?.employeeDetails.clientAllocated)[0];
  }

  getEmployeeTypes() {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: data => {
        this.sharedAccordionFunctionality.employeeTypes = data;
        this.sharedAccordionFunctionality.initializeEmployeeProfileDto();
      }
    });
  }

}

