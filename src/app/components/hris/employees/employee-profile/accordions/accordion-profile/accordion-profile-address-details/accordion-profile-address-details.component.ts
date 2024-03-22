import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { ClientService } from 'src/app/services/hris/client.service';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { FieldCodeService } from 'src/app/services/hris/field-code.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeAddressService } from 'src/app/services/hris/employee/employee-address.service';
import { FieldCode } from 'src/app/models/hris/field-code.interface';

@Component({
  selector: 'app-accordion-profile-address-details',
  templateUrl: './accordion-profile-address-details.component.html',
  styleUrls: ['./accordion-profile-address-details.component.css']
})
export class AccordionProfileAddressDetailsComponent {

  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeForm();
  }

  @Output() updateProfile = new EventEmitter<number>();
  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  addressFormProgress: number = 0;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    private employeeProfileService: EmployeeProfileService,
    private employeeDataService: EmployeeDataService,
    private clientService: ClientService,
    private employeeTypeService: EmployeeTypeService,
    private fieldCodeService: FieldCodeService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private employeeAddressService: EmployeeAddressService,
    ) {
  }

  usingProfile: boolean = true;

  initializeForm() {

    this.sharedAccordionFunctionality.addressDetailsForm = this.fb.group({
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
    this.sharedAccordionFunctionality.addressDetailsForm.disable();
    this.checkAddressFormProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls), "EmployeeAddress", true)
    }

  saveAddressEdit() {
    if (this.sharedAccordionFunctionality.physicalEqualPostal) {
      this.sharedAccordionFunctionality.addressDetailsForm.patchValue({
        postalUnitNumber: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalUnitNumber')?.value,
        postalComplexName: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalComplexName')?.value,
        postalStreetNumber: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalStreetNumber')?.value,
        postalSuburb: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalSuburb')?.value,
        postalCity: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalCity')?.value,
        postalCountry: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalCountry')?.value,
        postalProvince: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalProvince')?.value,
        postalPostalCode: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalPostalCode')?.value
      });
    }

    if (this.sharedAccordionFunctionality.addressDetailsForm.valid) {
      const addressDetailFormValue = this.sharedAccordionFunctionality.addressDetailsForm.value;

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
        unitNumber: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalUnitNumber'] : addressDetailFormValue['postalUnitNumber'],
        complexName: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalComplexName'] : addressDetailFormValue['postalComplexName'],
        streetNumber: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalStreetNumber'] : addressDetailFormValue['postalStreetNumber'],
        suburbOrDistrict: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalSuburb'] : addressDetailFormValue['postalSuburb'],
        city: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalCity'] : addressDetailFormValue['postalCity'],
        country: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalCountry'] : addressDetailFormValue['postalCountry'],
        province: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalProvince'] : addressDetailFormValue['postalProvince'],
        postalCode: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalPostalCode'] : addressDetailFormValue['postalPostalCode'],
      };
      this.employeeAddressService.update(postalAddressDto).subscribe({
        next: (postalData) => {
          this.employeeProfile!.employeeDetails.postalAddress = postalAddressDto;
          this.snackBarService.showSnackbar("Postal Details updated", "snack-success");
          this.employeeAddressService.update(physicalAddressDto).subscribe({
            next: (data) => {
              this.employeeProfile!.employeeDetails.physicalAddress = physicalAddressDto;
              this.snackBarService.showSnackbar("Physical address updated", "snack-success");
              this.sharedAccordionFunctionality.addressDetailsForm.disable();
              this.checkAddressFormProgress();
              this.sharedAccordionFunctionality.totalProfileProgress();
              this.getEmployeeFields();
              this.sharedAccordionFunctionality.editAddress = false;
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

  getEmployeeTypes() {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: data => {
        this.sharedAccordionFunctionality.employeeTypes = data;
        this.initializeEmployeeProfileDto();
      }
    });
  }

  getEmployeeFields() {
    this.sharedAccordionFunctionality.employeePhysicalAddress = this.employeeProfile.employeeDetails.physicalAddress!;
    this.sharedAccordionFunctionality.employeePostalAddress = this.employeeProfile.employeeDetails.postalAddress!;
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

  getEmployeeFieldCodes() {
    this.fieldCodeService.getAllFieldCodes().subscribe({
      next: data => {
        this.sharedAccordionFunctionality.customFields = data.filter((data: FieldCode) => data.category === this.sharedAccordionFunctionality.category[0].id);
      }
    })
  }

  editAddressDetails() {
    this.sharedAccordionFunctionality.editAddress = true;
    this.sharedAccordionFunctionality.addressDetailsForm.enable();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls), "EmployeeAddress", false)
  }

  cancelAddressEdit() {
    this.sharedAccordionFunctionality.editAddress = false;
    this.sharedAccordionFunctionality.hasDisability = false;
    this.initializeForm();
    this.sharedAccordionFunctionality.addressDetailsForm.disable();
  }

  toggleEqualFields() {
    this.sharedAccordionFunctionality.physicalEqualPostal = !this.sharedAccordionFunctionality.physicalEqualPostal;
  }

  checkAddressFormProgress() {
    let filledCount = 0;
    const formControls = this.sharedAccordionFunctionality.addressDetailsForm.controls;
    let totalFields = 0;
    if (this.sharedAccordionFunctionality.physicalEqualPostal) {
      totalFields = (Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls).length) / 2;
    }
    else if (!this.sharedAccordionFunctionality.physicalEqualPostal) {
      totalFields = (Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls).length);
    }

    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (this.sharedAccordionFunctionality.physicalEqualPostal && controlName.includes("physical") && control.value != null && control.value != " " && control.value != "") {
          filledCount++;
        }
        else if (!this.sharedAccordionFunctionality.physicalEqualPostal && control.value != null && control.value != " " && control.value != "") {
          filledCount++;
        }
      }
    }
    this.addressFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  checkEmployeeDetails() {

    if (this.usingProfile)
      this.checkEmployeeDetailsUsingEmployeeProfile()
    else
      this.checkEmployeeDetailsNotUsingEmployeeProfile()
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
    console.log(this.sharedAccordionFunctionality.employeeProfileDto);
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

  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.sharedAccordionFunctionality.addressDetailsForm.get(fieldName);


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
