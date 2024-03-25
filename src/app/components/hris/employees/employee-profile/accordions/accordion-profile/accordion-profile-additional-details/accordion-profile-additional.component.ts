import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Client } from 'src/app/models/hris/client.interface';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { levels } from 'src/app/models/hris/constants/levels.constants';
import { races } from 'src/app/models/hris/constants/races.constants';
import { genders } from 'src/app/models/hris/constants/genders.constants';
import { countries } from 'src/app/models/hris/constants/countries.constants';
import { disabilities } from 'src/app/models/hris/constants/disabilities.constant';
import { provinces } from 'src/app/models/hris/constants/provinces.constants';
import { CustomvalidationService } from 'src/app/services/hris/idnumber-validator';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { ClientService } from 'src/app/services/hris/client.service';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { FieldCodeService } from 'src/app/services/hris/field-code.service';
import { FieldCode } from 'src/app/models/hris/field-code.interface';
import { category } from 'src/app/models/hris/constants/fieldcodeCategory.constants';
import { EmployeeAddressService } from 'src/app/services/hris/employee/employee-address.service';
import { dataTypes } from 'src/app/models/hris/constants/types.constants';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { EmployeeProfilePermissions } from 'src/app/models/hris/property-access/employee-profile-properties.interface';
import { EmployeeAddressPermissions } from 'src/app/models/hris/property-access/employee-address-properties.interface';

@Component({
  selector: 'app-accordion-profile-additional',
  templateUrl: './accordion-profile-additional.component.html',
  styleUrls: ['./accordion-profile-additional.component.css']
})
export class AccordionProfileAdditionalComponent {
  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
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
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService) {
  }

  usingProfile: boolean = true;

  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeForm();
    this.getEmployeeFields();
    this.getClients();
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
    this.checkPropertyPermissions(Object.keys(this.employeeDetailsForm.controls), "Employee", true)
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
    if (!this.authAccessService.isEmployee()) {

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
    this.employeeService.getEmployeeProfiles().subscribe({
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
      }
    });
  }


  getEmployeeFieldCodes() {
    this.fieldCodeService.getAllFieldCodes().subscribe({
      next: data => {
        this.customFields = data.filter((data: FieldCode) => data.category === this.category[0].id);
        this.checkAdditionalInformation();
        this.checkAdditionalFormProgress();
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
        if (fieldName.required == true) {
          this.additionalInfoForm.controls[fieldName.code].setValidators(Validators.required);
        }
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


  editAdditionalDetails() {
    this.additionalInfoForm.enable();
    this.editAdditional = true;
    this.checkPropertyPermissions(Object.keys(this.additionalInfoForm.controls), "Employee", false)
  }

  cancelAdditionalEdit() {
    this.editAdditional = false;
    this.initializeForm();
    this.additionalInfoForm.disable();
  }

  saveAdditionalEdit() {
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
            this.additionalInfoForm.disable();
            this.editAdditional = false;
          },
          error: (error) => { this.snackBarService.showSnackbar(error, "snack-error") },
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
              this.additionalInfoForm.disable();
              this.editAdditional = false;
            },
            error: (error) => {
              this.snackBarService.showSnackbar(error, "snack-error");
            }
          });
        } else {
          this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
        }
      }
    }
  }

  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.additionalInfoForm.get(fieldName);

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
