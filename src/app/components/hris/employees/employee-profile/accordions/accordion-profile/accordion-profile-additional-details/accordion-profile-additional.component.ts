import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { CustomFieldService } from 'src/app/services/hris/field-code.service';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/components/shared-components/store/app.state';
import { StoreAccessService } from 'src/app/services/shared-services/store-service/store-access.service';
import { SetCustomField } from 'src/app/components/shared-components/store/actions/custom-field.actions';
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
    private store: Store<AppState>,
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private employeeDataService: EmployeeDataService,
    private storeAccessService: StoreAccessService,
    private customFieldService: CustomFieldService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    public navService: NavService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.usingProfile = this.employeeProfile && this.employeeProfile.simpleEmployee == undefined;
    this.loggedInProfile = this.navService.getEmployeeProfile();
    this.employeeId = this.route.snapshot.params['id'];
    this.loadEmployeeData();
  }
  
  loadEmployeeData() {
    this.getEmployeeData();
    if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin()) {
      this.getAllEmployees();
    }
    this.getEmployeeFieldCodes();
  }

  getEmployeeData() {
    const id = this.employeeId ?? this.loggedInProfile.id;
    this.employeeDataService.getEmployeeData(id).subscribe({
      next: data => {
        this.sharedAccordionFunctionality.employeeData = Array.isArray(data) ? data : [data];
      }
    });
  }

  getAllEmployees() {
    const clientData = this.sharedAccordionFunctionality.clients;
    const data = this.sharedAccordionFunctionality.employees;
    this.sharedAccordionFunctionality.employeeTeamLead = data.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.teamLead)[ 0 ];
    this.sharedAccordionFunctionality.employeePeopleChampion = data.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.peopleChampion)[ 0 ];
    this.sharedAccordionFunctionality.employeeClient = clientData.filter((client: any) => client.id === this.employeeProfile?.employeeDetails.clientAllocated)[ 0 ];
  }

  getEmployeeFieldCodes() {
    this.customFieldService.getAllFieldCodes().subscribe({
      next: data => {
        this.store.dispatch(SetCustomField({ payload: data }));
        this.checkArchived(data);
        this.checkAdditionalInformation();
        this.sharedAccordionFunctionality.checkAdditionalFormProgress();
        this.sharedAccordionFunctionality.totalProfileProgress();
      }
    });
  }

  checkArchived(fields: CustomField[]) {
    this.unarchivedCustomDocuments = fields.filter(field => !(field.status === this.fieldCodeStatus && field.category === 0));
    this.customFields = this.unarchivedCustomDocuments.filter(field => field.category == this.sharedAccordionFunctionality.category[0].id);
  }

  checkAdditionalInformation() {
    const formGroupConfig: any = {};
    this.customFields.forEach(field => {
      if (field.code) {
        const customData = this.sharedAccordionFunctionality.employeeData.find(data => data.fieldCodeId === field.id);
        const value = customData ? customData.value : '';
        formGroupConfig[field.code] = new FormControl({ value, disabled: true }, this.getFieldValidators(field));
      }
    });

    this.sharedAccordionFunctionality.additionalInfoForm = this.fb.group(formGroupConfig);
    this.sharedAccordionFunctionality.additionalInfoForm.disable();
  }

  getFieldValidators(field: CustomField) {
    const validators = [];
    if (field.required) validators.push(Validators.required);
    if (field.regex) validators.push(Validators.pattern(field.regex as string));
    return validators;
  }

  editAdditionalDetails() {
    this.sharedAccordionFunctionality.additionalInfoForm.enable();
    this.sharedAccordionFunctionality.editAdditional = true;
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.additionalInfoForm.controls), "Employee", false);
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
    this.customFields.forEach(field => {
      if (!field.code) {
        return;
      }
      const formatFound = field.code;
      const found = this.sharedAccordionFunctionality.employeeData.find(data => field.id === data.fieldCodeId);
      const employeeDataDto = {
        id: found ? found.id : 0,
        employeeId: this.employeeId ?? this.loggedInProfile.id!,
        fieldcodeId: field.id,
        value: String(this.sharedAccordionFunctionality.additionalInfoForm.get(formatFound)?.value || '')
      };
      if (employeeDataDto.value) {
        (found ? this.employeeDataService.updateEmployeeData(employeeDataDto) : this.employeeDataService.saveEmployeeData(employeeDataDto)).subscribe({
          next: () => {
            this.snackBarService.showSnackbar(found ? "Updated" : "Saved", "snack-success");
            this.sharedAccordionFunctionality.checkAdditionalFormProgress();
            this.sharedAccordionFunctionality.totalProfileProgress();
            this.sharedAccordionFunctionality.additionalInfoForm.disable();
            this.sharedAccordionFunctionality.editAdditional = false;
            this.getEmployeeData();
            this.updateEmployeeProfile.emit(1);
          },
          error: () => this.snackBarService.showError(`Failed to ${found ? "update" : "save"} field`)
        });
      }
    });
  }

  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    if (!this.sharedPropertyAccessService.accessProperties) return;
    fieldNames.forEach(fieldName => {
      const control: AbstractControl | null = this.sharedAccordionFunctionality.additionalInfoForm.get(fieldName);
      if (control) {
        const hasWritePermission = this.sharedPropertyAccessService.checkPermission(table, fieldName) === PropertyAccessLevel.write;
        const hasReadPermission = this.sharedPropertyAccessService.checkPermission(table, fieldName) === PropertyAccessLevel.read;
        if (hasWritePermission) {
          control.enable();
        } else if (hasReadPermission) {
          control.disable();
        } else {
          control.disable();
        }
      }
    });
  }
}