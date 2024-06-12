import { Component, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { ClientService } from 'src/app/services/hris/client.service';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { CustomFieldService } from 'src/app/services/hris/field-code.service';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';
import { EventEmitter } from '@angular/core';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accordion-career-additional-information',
  templateUrl: './accordion-career-additional-information.component.html',
  styleUrls: ['./accordion-career-additional-information.component.css']
})
export class AccordionCareerAdditionalInformationComponent {
  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  usingProfile: boolean = true;

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  @Output() updateEmployeeProfile = new EventEmitter<any>();
  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  customFields: CustomField[] = [];
  employeeId: number | undefined;
  loggedInProfile!: EmployeeData;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    private employeeProfileService: EmployeeProfileService,
    private employeeDataService: EmployeeDataService,
    private clientService: ClientService,
    private employeeTypeService: EmployeeTypeService,
    private customFieldService: CustomFieldService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    public navService: NavService,
    public route: ActivatedRoute) {
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
        }, complete: () => {
          this.getEmployeeData();
          this.getEmployeeTypes();
          if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin() || this.authAccessService.isJourney() || this.authAccessService.isTalent()) {
            this.getAllEmployees();
          }
          this.getEmployeeFieldCodes();
        }, error: () => {
          this.snackBarService.showSnackbar("Error fetching user profile", "snack-error");
        }
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
    this.employeeService.getEmployeeProfiles().subscribe({
      next: data => {
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

  getEmployeeTypes() {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: (data) => {
        this.sharedAccordionFunctionality.employeeTypes = data;
      }
    });
  }

  getEmployeeFieldCodes() {
    this.customFieldService.getAllFieldCodes().subscribe({
      next: data => {
        this.customFields = data.filter((data: CustomField) => data.category === this.sharedAccordionFunctionality.category[2].id);
        this.checkAdditionalInformation();
        this.sharedAccordionFunctionality.calculateCareerAdditionalFormProgress();
        this.sharedAccordionFunctionality.totalCareerProgress();
      }
    })
  }

  checkAdditionalInformation() {
    const formGroupConfig: any = {};
    this.customFields.forEach(fieldName => {
      if (fieldName.code != null || fieldName.code != undefined) {
        const customData = this.sharedAccordionFunctionality.employeeData.filter((data: EmployeeData) => data.fieldCodeId === fieldName.id)
        formGroupConfig[fieldName.code] = new FormControl({ value: customData[0] ? customData[0].value : '', disabled: true });
        this.sharedAccordionFunctionality.additionalCareerInfoForm = this.fb.group(formGroupConfig);
        if (fieldName.required == true) {
          this.sharedAccordionFunctionality.additionalCareerInfoForm.controls[fieldName.code].setValidators(Validators.required);
        }
        this.sharedAccordionFunctionality.additionalCareerInfoForm.disable();
      }
    });
  }

  editAdditionalDetails() {
    this.sharedAccordionFunctionality.additionalCareerInfoForm.enable();
    this.sharedAccordionFunctionality.editAdditional = true;
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.additionalCareerInfoForm.controls), "Employee", false)
  }

  cancelAdditionalEdit() {
    this.sharedAccordionFunctionality.editAdditional = false;
    this.sharedAccordionFunctionality.additionalCareerInfoForm.disable();
  }

  saveAdditionalEdit() {
    const empDataValues = this.sharedAccordionFunctionality.employeeData;
    if (!this.sharedAccordionFunctionality.additionalCareerInfoForm.valid) {
      this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
      return;
    }
    for (const fieldcode of this.customFields) {
      const found = empDataValues.find((data) => {
        return fieldcode.id === data.fieldCodeId
      });

      if (found) {
        const formatFound: any = fieldcode.code
        const employeeDataDto = {
          id: found.id,
          employeeId: this.employeeId != undefined ? this.employeeId : this.loggedInProfile.id!,
          fieldcodeId: found.fieldCodeId,
          value: this.sharedAccordionFunctionality.additionalCareerInfoForm.get(formatFound)?.value
        }

        this.employeeDataService.updateEmployeeData(employeeDataDto).subscribe({
          next: (data) => {
            this.snackBarService.showSnackbar("Employee Details updated", "snack-success");
            this.sharedAccordionFunctionality.calculateCareerAdditionalFormProgress();
            this.sharedAccordionFunctionality.totalCareerProgress();
            this.sharedAccordionFunctionality.additionalCareerInfoForm.disable();
            this.sharedAccordionFunctionality.editAdditional = false;
            this.getEmployeeData();
            this.updateEmployeeProfile.emit(1);
          },
          error: (error) => { this.snackBarService.showSnackbar(error, "snack-error") },
        });
      } else {
        const formatFound: any = fieldcode?.code
        const employeeDataDto = {
          id: 0,
          employeeId: this.employeeId != undefined ? this.employeeId : this.loggedInProfile.id!,
          fieldcodeId: fieldcode.id,
          value: this.sharedAccordionFunctionality.additionalCareerInfoForm.get(formatFound)?.value
        }

        if (employeeDataDto.value) {
          this.employeeDataService.saveEmployeeData(employeeDataDto).subscribe({
            next: (data) => {
              this.snackBarService.showSnackbar("Employee Details updated", "snack-success");
              this.sharedAccordionFunctionality.calculateCareerAdditionalFormProgress();
              this.sharedAccordionFunctionality.totalCareerProgress();
              this.sharedAccordionFunctionality.additionalCareerInfoForm.disable();
              this.sharedAccordionFunctionality.editAdditional = false;
              this.getEmployeeData();
              this.updateEmployeeProfile.emit(1);
            },
            error: (error) => {
              this.snackBarService.showSnackbar(error, "snack-error");
            }
          });
        }
      }
    }
  }

  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.sharedAccordionFunctionality.additionalCareerInfoForm.get(fieldName);

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
