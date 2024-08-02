import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
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
import { StoreAccessService } from 'src/app/services/shared-services/store-service/store-access.service';

@Component({
  selector: 'app-accordion-profile-additional',
  templateUrl: './accordion-profile-additional.component.html',
  styleUrls: ['./accordion-profile-additional.component.css']
})
export class AccordionProfileAdditionalComponent {
  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  usingProfile: boolean = true;

  onResize() {
    this.screenWidth = window.innerWidth;
  }
  @Output() updateEmployeeProfile = new EventEmitter<any>();

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  customFields: CustomField[] = [];
  unarchivedCustomDocuments: CustomField[] = [];
  additionalFormProgress: number = 0;
  fieldCodeStatus: number = -1;
  employeeId: number | undefined;
  loggedInProfile!: EmployeeProfile | SimpleEmployee;

  constructor(
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private employeeProfileService: EmployeeProfileService,
    private employeeDataService: EmployeeDataService,
    private storeAccessService: StoreAccessService,
    private employeeTypeService: EmployeeTypeService,
    private customFieldService: CustomFieldService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    public navService: NavService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.loggedInProfile = this.navService.getEmployeeProfile();
    this.employeeId = this.route.snapshot.params['id'];
    this.getEmployeeFields();
    this.getEmployeeData();
  }

  getEmployeeFields() {
    this.getEmployeeData();
    this.getEmployeeTypes();
    if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin()) {
      this.getAllEmployees();
    }
    this.getEmployeeFieldCodes();
    if (!this.authAccessService.isEmployee()) {
      this.employeeProfileService.getEmployeeById(this.employeeProfile.employeeDetails.id as number).subscribe({
        next: data => {
          this.employeeProfile.employeeDetails = data;
        },
        complete: () => {
          this.getEmployeeData();
          this.getEmployeeTypes();
          if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin() || this.authAccessService.isJourney() || this.authAccessService.isTalent()) {
            this.getAllEmployees();
          }
          this.getEmployeeFieldCodes();
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
      this.employeeDataService.getEmployeeData(this.loggedInProfile.id).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.employeeData = data;
        }
      });
    }
  }

  getAllEmployees() {
    const data = this.storeAccessService.getEmployeeProfiles();
    const clientData = this.storeAccessService.getClients();
    this.sharedAccordionFunctionality.employees = data;
    this.sharedAccordionFunctionality.employeeTeamLead = data.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.teamLead)[ 0 ];
    this.sharedAccordionFunctionality.employeePeopleChampion = data.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.peopleChampion)[ 0 ];
    this.sharedAccordionFunctionality.employeeClient = clientData.filter((client: any) => client.id === this.employeeProfile?.employeeDetails.clientAllocated)[ 0 ];
  }

  getEmployeeTypes() {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: data => {
        this.sharedAccordionFunctionality.employeeTypes = data;
      }
    });
  }

  getEmployeeFieldCodes() {
    this.customFieldService.getAllFieldCodes().subscribe({
      next: data => {
        this.checkAdditionalInformation();
        this.sharedAccordionFunctionality.checkAdditionalFormProgress();
        this.sharedAccordionFunctionality.totalProfileProgress();
        this.checkArchived(data);
      }
    })
  }

  checkArchived(fields: CustomField[]) {
    this.unarchivedCustomDocuments = [];
    var index = 0;
    fields.forEach((field) => {
      if (this.fieldCodeStatus == field.status && field.category === 0) {
        fields.splice(index, 1);
      }
      else {
        this.unarchivedCustomDocuments.push(field);
        this.customFields = this.unarchivedCustomDocuments.filter((field: any) => field.category == this.sharedAccordionFunctionality.category[0].id)
      }
      index++;
    })
  }

  checkAdditionalInformation() {
    const formGroupConfig: any = {};
    this.customFields.forEach(fieldName => {
      if (fieldName.code != null || fieldName.code != undefined) {
        const customData = this.sharedAccordionFunctionality.employeeData.filter((data: EmployeeData) => data.fieldCodeId === fieldName.id);
        const value = customData[0] ? customData[0].value : '';
        const control = new FormControl({ value: value, disabled: true });
        const validators = [];
        if (fieldName.required) {
          validators.push(Validators.required);
        }
        if (fieldName.regex) {
          validators.push(Validators.pattern(fieldName.regex as string));
        }
        control.setValidators(validators);
        formGroupConfig[fieldName.code] = control;
      }
    });

    this.sharedAccordionFunctionality.additionalInfoForm = this.fb.group(formGroupConfig);
    this.sharedAccordionFunctionality.additionalInfoForm.disable();
  }

  editAdditionalDetails() {
    this.sharedAccordionFunctionality.additionalInfoForm.enable();
    this.sharedAccordionFunctionality.editAdditional = true;
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.additionalInfoForm.controls), "Employee", false)
  }

  cancelAdditionalEdit() {
    this.sharedAccordionFunctionality.editAdditional = false;
    this.sharedAccordionFunctionality.additionalInfoForm.disable();
  }

  saveAdditionalEdit() {
    if (!this.sharedAccordionFunctionality.additionalInfoForm.valid) {
      this.snackBarService.showSnackbar("Some Fields Are Still Missing Information", "snack-error");
      return;
    }
    for (const fieldcode of this.customFields) {
      const found = this.sharedAccordionFunctionality.employeeData.find((data) => {
        return fieldcode.id === data.fieldCodeId
      });
      if (found) {
        const formatFound: any = fieldcode.code
        const employeeDataDto = {
          id: found.id,
          employeeId: this.employeeId != undefined ? this.employeeId : this.loggedInProfile.id!,
          fieldcodeId: found.fieldCodeId,
          value: String(this.sharedAccordionFunctionality.additionalInfoForm.get(formatFound)?.value)
        }
        this.employeeDataService.updateEmployeeData(employeeDataDto).subscribe({
          next: () => {
            this.snackBarService.showSnackbar("Updated", "snack-success");
            this.sharedAccordionFunctionality.checkAdditionalFormProgress();
            this.sharedAccordionFunctionality.totalProfileProgress();
            this.sharedAccordionFunctionality.additionalInfoForm.disable();
            this.sharedAccordionFunctionality.editAdditional = false;
            this.getEmployeeData();
            this.updateEmployeeProfile.emit(1);
          },
          error: () => this.snackBarService.showError("Failed to update field"),
        });
      } else {
        const formatFound: any = fieldcode?.code
        const employeeDataDto = {
          id: 0,
          employeeId: this.employeeId != undefined ? this.employeeId : this.loggedInProfile.id!,
          fieldcodeId: fieldcode.id,
          value: String(this.sharedAccordionFunctionality.additionalInfoForm.get(formatFound)?.value)
        }

        if (employeeDataDto.value) {
          this.employeeDataService.saveEmployeeData(employeeDataDto).subscribe({
            next: () => {
              this.snackBarService.showSnackbar("Saved", "snack-success");
              this.sharedAccordionFunctionality.checkAdditionalFormProgress();
              this.sharedAccordionFunctionality.totalProfileProgress();
              this.sharedAccordionFunctionality.additionalInfoForm.disable();
              this.sharedAccordionFunctionality.editAdditional = false;
              this.getEmployeeData();
              this.updateEmployeeProfile.emit(1);
            },
            error: () => this.snackBarService.showError("Failed to save field"),
          });
        }
      }
    }
  }

  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    if (!this.sharedPropertyAccessService.accessProperties) {
      return;
    }
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.sharedAccordionFunctionality.additionalInfoForm.get(fieldName);

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
