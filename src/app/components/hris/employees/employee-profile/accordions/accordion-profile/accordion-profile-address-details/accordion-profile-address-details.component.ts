import { Component, HostListener, Input } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { LocationApiService } from 'src/app/services/hris/location-api.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { ActivatedRoute } from '@angular/router';
import { EmployeeAddressService } from 'src/app/services/hris/employee/employee-address.service';

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
  employeeAddress: EmployeeAddress[] = [];

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  constructor(
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    public authAccessService: AuthAccessService,
    public employeeAddressService: EmployeeAddressService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    public locationApiService: LocationApiService,
    public navService: NavService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadPhysicalAddress();
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.getEmployeeFields();
    this.getEmployeeAddress();
  }

  initializeForm(addressDetails: EmployeeAddress) {
    this.sharedAccordionFunctionality.addressDetailsForm = this.fb.group({
      physicalUnitNumber: [addressDetails.unitNumber?.trim(), [Validators.pattern(/^[0-9]*$/)]],
      physicalComplexName: [addressDetails.complexName?.trim()],
      physicalStreetNumber: [addressDetails.streetNumber?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      physicalStreetName: [addressDetails.streetName?.trim(), Validators.required],
      physicalCity: [addressDetails.city?.trim(), Validators.required],
      physicalSuburb: [addressDetails.suburbOrDistrict?.trim()],
      physicalCountry: [addressDetails.country?.trim(), Validators.required],
      physicalProvince: [addressDetails.province?.trim(), Validators.required],
      physicalPostalCode: [addressDetails.postalCode?.trim(), [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(4), Validators.minLength(4)]],
    });
    this.sharedAccordionFunctionality.addressDetailsForm.disable();
    this.sharedAccordionFunctionality.checkAddressFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls), "EmployeeAddress", true)
  }

  saveAddressEdit() {

    if (this.sharedAccordionFunctionality.addressDetailsForm.valid) {
      const addressDetailFormValue = this.sharedAccordionFunctionality.addressDetailsForm.value;

      const physicalAddressDto: EmployeeAddress = {
        id: this.employeeAddress ? this.employeeAddress[this.employeeAddress.length - 1].id : 0,
        employeeId: this.employeeProfile!.employeeDetails?.id!,
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
      if (this.employeeAddress) {
        this.employeeAddressService.update(physicalAddressDto).subscribe({
          next: () => {
            this.snackBarService.showSnackbar("Updated", "snack-success");
          },
          error: (er) => this.snackBarService.showError(er)
        })
      } else {
        this.employeeAddressService.save(physicalAddressDto).subscribe({
          next: () => {
            this.snackBarService.showSnackbar("Saved", "snack-success");
          },
          error: (er) => this.snackBarService.showError(er)
        })
      }
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

  loadProvinces(country: string): void {
    this.locationApiService.getProvinces(country).subscribe({
      next: (data) => this.provinces = data
    });
  }

  loadCities(province: string): void {
    this.locationApiService.getCities(this.selectedCountry, province).subscribe({
      next: (data) => this.cities = data,
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

  getEmployeeAddress() {
    const currentEmployeeId = this.employeeId != undefined ? this.employeeId : this.navService.employeeProfile.id
    this.employeeAddressService.getById(currentEmployeeId).subscribe({
      next: (data) => {
        this.employeeAddress = data;
        if (this.employeeAddress && this.employeeAddress.length > 0) {
          this.initializeForm(this.employeeAddress[this.employeeAddress.length - 1]);
        }
      },
      error: (er) => this.snackBarService.showError(er),
    });

  }

  getEmployeeFields() {
    this.sharedAccordionFunctionality.employeePhysicalAddress = this.employeeProfile.employeeDetails.physicalAddress!;
    this.initializeForm(this.employeeAddress[this.employeeAddress.length - 1]);
  }

  editAddressDetails() {
    this.editAddress = true;

    this.sharedAccordionFunctionality.addressDetailsForm.enable();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls), "EmployeeAddress", false)
  }

  cancelAddressEdit() {
    this.editAddress = false;
    this.sharedAccordionFunctionality.hasDisability = false;
    this.initializeForm(this.employeeAddress[this.employeeAddress.length - 1]);
    this.sharedAccordionFunctionality.addressDetailsForm.disable();
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
