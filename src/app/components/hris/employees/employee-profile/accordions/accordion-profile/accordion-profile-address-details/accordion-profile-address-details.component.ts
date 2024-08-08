import { Component, HostListener, Input } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeAddressService } from 'src/app/services/hris/employee/employee-address.service';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { LocationApiService } from 'src/app/services/hris/location-api.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accordion-profile-address-details',
  templateUrl: './accordion-profile-address-details.component.html',
  styleUrls: ['./accordion-profile-address-details.component.css']
})
export class AccordionProfileAddressDetailsComponent {

  screenWidth = window.innerWidth;
  usingProfile: boolean = true;
  provinces: string[] = [];
  countries: string[] = [];
  cities: string[] = [];
  postalProvinces: string[] = [];
  postalCountries: string[] = [];
  postalCities: string[] = [];
  selectedCountry: string = '';
  selectedProvince: string = '';
  selectedPostalCountry: string = '';
  selectedPostalProvince: string = '';
  employeeId = this.route.snapshot.params['id'];
  country: any;
  province: any;
  city: any;
  streetNumber: string = '';
  streetName: string = '';
  streetcode: string = '';
  editAddress: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  constructor(
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private employeeDataService: EmployeeDataService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private employeeAddressService: EmployeeAddressService,
    public locationApiService: LocationApiService,
    public navService: NavService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadPhysicalAddress();
    this.loadPostalAddress();
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.initializeEmployeeProfileDto();
    this.getEmployeeFields();
  }

  initializeForm() {
    this.sharedAccordionFunctionality.addressDetailsForm = this.fb.group({
      physicalUnitNumber: [this.employeeProfile!.employeeDetails.physicalAddress?.unitNumber?.trim(), [Validators.pattern(/^[0-9]*$/)]],
      physicalComplexName: [this.employeeProfile!.employeeDetails.physicalAddress?.complexName?.trim()],
      physicalStreetNumber: [this.employeeProfile!.employeeDetails.physicalAddress?.streetNumber?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      physicalStreetName: [this.employeeProfile!.employeeDetails.physicalAddress?.streetName?.trim(), Validators.required],
      physicalCity: [this.employeeProfile!.employeeDetails.physicalAddress?.city?.trim(), Validators.required],
      physicalSuburb: [this.employeeProfile!.employeeDetails.physicalAddress?.suburbOrDistrict?.trim()],
      physicalCountry: [this.employeeProfile!.employeeDetails.physicalAddress?.country?.trim(), Validators.required],
      physicalProvince: [this.employeeProfile!.employeeDetails.physicalAddress?.province?.trim(), Validators.required],
      physicalPostalCode: [this.employeeProfile!.employeeDetails.physicalAddress?.postalCode?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(4), Validators.minLength(4)]],
      postalUnitNumber: [this.employeeProfile!.employeeDetails.postalAddress?.unitNumber?.trim(), [Validators.pattern(/^[0-9]*$/)]],
      postalComplexName: [this.employeeProfile!.employeeDetails.postalAddress?.complexName?.trim()],
      postalStreetNumber: [this.employeeProfile!.employeeDetails.postalAddress?.streetNumber?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      postalStreetName: [this.employeeProfile!.employeeDetails.postalAddress?.streetName?.trim(), Validators.required],
      postalCity: [this.employeeProfile!.employeeDetails.postalAddress?.city?.trim(), Validators.required],
      postalSuburb: [this.employeeProfile!.employeeDetails.postalAddress?.suburbOrDistrict?.trim()],
      postalCountry: [this.employeeProfile!.employeeDetails.postalAddress?.country?.trim(), Validators.required],
      postalProvince: [this.employeeProfile!.employeeDetails.postalAddress?.province?.trim(), Validators.required],
      postalPostalCode: [this.employeeProfile!.employeeDetails.postalAddress?.postalCode?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(4), Validators.minLength(4)]]
    });
    this.sharedAccordionFunctionality.addressDetailsForm.disable();
    this.sharedAccordionFunctionality.checkAddressFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls), "EmployeeAddress", true)
  }

  saveAddressEdit() {
    if (this.sharedAccordionFunctionality.physicalEqualPostal) {
      this.sharedAccordionFunctionality.addressDetailsForm.patchValue({
        postalUnitNumber: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalUnitNumber')?.value,
        postalComplexName: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalComplexName')?.value,
        postalStreetNumber: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalStreetNumber')?.value,
        postalStreetName: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalStreetName')?.value,
        postalCity: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalCity')?.value,
        postalSuburb: this.sharedAccordionFunctionality.addressDetailsForm.get('physicalSuburb')?.value,
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
        streetName: addressDetailFormValue['physicalStreetName'],
        streetNumber: addressDetailFormValue['physicalStreetNumber'],
        city: addressDetailFormValue['physicalCity'],
        suburbOrDistrict: addressDetailFormValue['physicalSuburb'],
        country: addressDetailFormValue['physicalCountry'],
        province: addressDetailFormValue['physicalProvince'],
        postalCode: addressDetailFormValue['physicalPostalCode'],
      };

      const postalAddressDto: EmployeeAddress = {
        id: this.employeeProfile!.employeeDetails.postalAddress?.id!,
        unitNumber: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalUnitNumber'] : addressDetailFormValue['postalUnitNumber'],
        complexName: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalComplexName'] : addressDetailFormValue['postalComplexName'],
        streetNumber: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalStreetNumber'] : addressDetailFormValue['postalStreetNumber'],
        streetName: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalStreetName'] : addressDetailFormValue['postalStreetName'],
        city: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalCity'] : addressDetailFormValue['postalCity'],
        suburbOrDistrict: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalSuburb'] : addressDetailFormValue['postalSuburb'],
        country: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalCountry'] : addressDetailFormValue['postalCountry'],
        province: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalProvince'] : addressDetailFormValue['postalProvince'],
        postalCode: this.sharedAccordionFunctionality.physicalEqualPostal ? addressDetailFormValue['physicalPostalCode'] : addressDetailFormValue['postalPostalCode'],
      };
      this.employeeAddressService.update(postalAddressDto).subscribe({
        next: () => {
          this.employeeProfile!.employeeDetails.postalAddress = postalAddressDto;
          this.snackBarService.showSnackbar("Updated", "snack-success");
          this.employeeAddressService.update(physicalAddressDto).subscribe({
            next: () => {
              this.employeeProfile!.employeeDetails.physicalAddress = physicalAddressDto;
              this.snackBarService.showSnackbar("Updated", "snack-success");
              this.navService.refreshEmployee();
              this.sharedAccordionFunctionality.addressDetailsForm.disable();
              this.sharedAccordionFunctionality.checkAddressFormProgress();
              this.sharedAccordionFunctionality.totalProfileProgress();
              this.getEmployeeFields();
              this.editAddress = false;
            },
            error: (er) => this.snackBarService.showError(er),
          });
        },
        error: (er: any) => this.snackBarService.showError(er),
      });
    } else {
      this.snackBarService.showSnackbar("Some Fields Are Still Missing Information", "snack-error");
    }
    this.cancelAddressEdit();
  }

  onCountryChange(country: string): void {
    this.selectedCountry = country;
    this.loadProvinces(this.selectedCountry);
    this.provinces = [];
    this.cities = [];
  }

  onPostalCountryChange(country: string): void {
    this.selectedPostalCountry = country;
    this.loadPostalProvinces(this.selectedPostalProvince);
    this.postalProvinces = [];
    this.postalCities = [];
  }

  loadProvinces(country: string): void {
    this.locationApiService.getProvinces(country).subscribe({
      next: (data) => this.provinces = data
    });
  }

  loadPostalProvinces(country: string): void {
    this.locationApiService.getProvinces(this.selectedPostalCountry).subscribe({
      next: (data) => this.postalProvinces = data
    });
  }

  loadCities(province: string): void {
    this.locationApiService.getCities(this.selectedCountry, province).subscribe({
      next: (data) => this.cities = data,
    });
    this.selectedProvince = province;
  }

  loadPostalCities(province: string): void {
    this.locationApiService.getCities(this.selectedPostalCountry, province).subscribe({
      next: (data) => this.postalCities = data,
    });
    this.selectedProvince = province;
  }

  loadPhysicalAddress() {
    this.locationApiService.getCountries().subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          return;
        }
        this.countries = data;
        this.selectedCountry = this.employeeProfile?.employeeDetails.physicalAddress?.country || '';
        if (!this.selectedCountry.trim()) {
          return;
        }
        this.locationApiService.getProvinces(this.selectedCountry).subscribe({
          next: (data) => {
            if (!data || data.length === 0) {
              return;
            }
            this.provinces = data;
            this.selectedProvince = this.employeeProfile?.employeeDetails.physicalAddress?.province || '';
            if (this.selectedProvince) {
              this.locationApiService.getCities(this.selectedCountry, this.selectedProvince).subscribe({
                next: (data) => {
                  if (!data || data.length === 0) {
                    return;
                  }
                  this.cities = data;
                },
                error: (error: any) => {
                  this.snackBarService.showSnackbar('Unable to Load Cities', "snack-error");
                }
              });
            }
          },
          error: (error: any) => {
            this.snackBarService.showSnackbar('Unable to Load Provinces', "snack-error");
          }
        });
      },
      error: (error: any) => {
        this.snackBarService.showSnackbar('Unable to Load Countries', "snack-error");
      }
    });
  }

  loadPostalAddress() {
    if (this.sharedAccordionFunctionality.physicalEqualPostal) {
      return;
    }
    this.locationApiService.getCountries().subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          return;
        }
        this.postalCountries = data;
        this.selectedPostalCountry = this.employeeProfile?.employeeDetails.postalAddress?.country || '';
        if (!this.selectedPostalCountry.trim()) {
          return;
        }
        this.locationApiService.getProvinces(this.selectedPostalCountry).subscribe({
          next: (data) => {
            if (!data || data.length === 0) {
              return;
            }
            this.postalProvinces = data;
            this.selectedPostalProvince = this.employeeProfile?.employeeDetails.postalAddress?.province || '';
            if (this.selectedPostalProvince) {
              this.locationApiService.getCities(this.selectedPostalCountry, this.selectedPostalProvince).subscribe({
                next: (data) => {
                  if (!data || data.length === 0) {
                    return;
                  }
                  this.postalCities = data;
                },
                error: (error: any) => {
                  this.snackBarService.showSnackbar('Unable to Load Cities', "snack-error");
                }
              });
            }
          },
          error: (error: any) => {
            this.snackBarService.showSnackbar('Unable to Load Provinces', "snack-error");
          }
        });
      },
      error: (error: any) => {
        this.snackBarService.showSnackbar('Unable to Load Countries', "snack-error");
      }
    });
  }

  getAllEmployees() {
    const data = this.sharedAccordionFunctionality.employees;
    this.sharedAccordionFunctionality.employeeTeamLead = data.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.teamLead)[ 0 ];
    this.sharedAccordionFunctionality.employeePeopleChampion = data.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.employeeDetails.peopleChampion)[ 0 ];
    this.sharedAccordionFunctionality.employeeClient = this.sharedAccordionFunctionality.clients.filter((client: any) => client.id === this.employeeProfile?.employeeDetails.clientAllocated)[ 0 ];
  }

  getEmployeeFields() {
    this.sharedAccordionFunctionality.employeePhysicalAddress = this.employeeProfile.employeeDetails.physicalAddress!;
    this.sharedAccordionFunctionality.employeePostalAddress = this.employeeProfile.employeeDetails.postalAddress!;
    this.sharedAccordionFunctionality.hasDisability = this.employeeProfile.employeeDetails.disability;
    this.sharedAccordionFunctionality.hasDisability = this.employeeProfile!.employeeDetails.disability;
    this.initializeEmployeeProfileDto();
    if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin()) {
      this.getAllEmployees();
    }
    this.getEmployeeFieldCodes();
    this.initializeForm();
    if (!this.authAccessService.isEmployee()) {
      var data = this.sharedAccordionFunctionality.selectedEmployee;
      this.employeeProfile.employeeDetails = data;
      this.sharedAccordionFunctionality.employeePhysicalAddress = data.physicalAddress!;
      this.sharedAccordionFunctionality.employeePostalAddress = data.postalAddress!;
      this.sharedAccordionFunctionality.hasDisability = data.disability;
      this.sharedAccordionFunctionality.hasDisability = this.employeeProfile!.employeeDetails.disability;

      this.initializeEmployeeProfileDto();
      if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin() || this.authAccessService.isJourney() || this.authAccessService.isTalent()) {
        this.getAllEmployees();
      }
      this.getEmployeeFieldCodes();
      this.initializeForm();
    }
  }

  getEmployeeFieldCodes() {
    var data = this.sharedAccordionFunctionality.fieldCodes;
    this.sharedAccordionFunctionality.customFields = data.filter((data: CustomField) => data.category === this.sharedAccordionFunctionality.category[0].id);
  }

  editAddressDetails() {
    this.editAddress = true;

    this.sharedAccordionFunctionality.addressDetailsForm.enable();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls), "EmployeeAddress", false)
  }

  cancelAddressEdit() {
    this.editAddress = false;
    this.sharedAccordionFunctionality.hasDisability = false;
    this.initializeForm();
    this.sharedAccordionFunctionality.addressDetailsForm.disable();
  }

  toggleEqualFields() {
    this.sharedAccordionFunctionality.physicalEqualPostal = !this.sharedAccordionFunctionality.physicalEqualPostal;
  }

  checkEmployeeDetails() {
    if (this.usingProfile)
      this.checkEmployeeDetailsUsingEmployeeProfile()
    else
      this.checkEmployeeDetailsNotUsingEmployeeProfile()
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
    if (!this.sharedPropertyAccessService.accessProperties) {
      return;
    }
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
