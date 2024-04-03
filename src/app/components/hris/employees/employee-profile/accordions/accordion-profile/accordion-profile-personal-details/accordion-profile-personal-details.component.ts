import { Component, HostListener, Input } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';

@Component({
  selector: 'app-accordion-profile-personal-details',
  templateUrl: './accordion-profile-personal-details.component.html',
  styleUrls: ['./accordion-profile-personal-details.component.css']
})
export class AccordionProfilePersonalDetailsComponent {

  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  usingProfile: boolean = true;
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeForm();
  }

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  initializeForm() {
    this.sharedAccordionFunctionality.personalDetailsForm = this.fb.group({
      gender: [this.employeeProfile!.employeeDetails.gender, Validators.required],
      race: [this.employeeProfile!.employeeDetails.race, Validators.required],
      disability: [this.employeeProfile!.employeeDetails.disability, Validators.required],
      disabilityList: "",
      disabilityNotes: [this.employeeProfile!.employeeDetails.disabilityNotes]
    });
    this.sharedAccordionFunctionality.personalDetailsForm.disable();
    this.sharedAccordionFunctionality.checkPersonalFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();
    this.checkEmployeeDetails();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.personalDetailsForm.controls), "Employee", true)
  }

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) {
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

  editPersonalDetails() {
    this.sharedAccordionFunctionality.editPersonal = true;
    this.sharedAccordionFunctionality.personalDetailsForm.enable();
  }

  setHasDisability(event: any) {
    this.sharedAccordionFunctionality.hasDisability = event.value;
  }

  savePersonalEdit() {
    if (this.sharedAccordionFunctionality.personalDetailsForm.valid) {
      const personalDetailsFormValue = this.sharedAccordionFunctionality.personalDetailsForm.value;
      this.sharedAccordionFunctionality.employeeProfileDto.disability = personalDetailsFormValue.disability;
      this.sharedAccordionFunctionality.employeeProfileDto.disabilityNotes = personalDetailsFormValue.disabilityNotes;
      this.sharedAccordionFunctionality.employeeProfileDto.race = personalDetailsFormValue.race;
      this.sharedAccordionFunctionality.employeeProfileDto.gender = personalDetailsFormValue.gender;
      this.employeeService.updateEmployee(this.sharedAccordionFunctionality.employeeProfileDto).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Personal details updated", "snack-success");
          this.sharedAccordionFunctionality.checkPersonalFormProgress();
          this.sharedAccordionFunctionality.totalProfileProgress();
          this.sharedAccordionFunctionality.personalDetailsForm.disable();
          this.sharedAccordionFunctionality.editPersonal = false;
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

  cancelPersonalEdit() {
    this.sharedAccordionFunctionality.editPersonal = false;
    this.sharedAccordionFunctionality.hasDisability = false;
    this.initializeForm();
    this.sharedAccordionFunctionality.personalDetailsForm.disable();
  }

  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.sharedAccordionFunctionality.personalDetailsForm.get(fieldName);

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
