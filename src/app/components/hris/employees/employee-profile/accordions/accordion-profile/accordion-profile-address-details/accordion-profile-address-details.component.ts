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
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
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


  getEmployeeFields() {
    this.sharedAccordionFunctionality.employeePhysicalAddress = this.employeeProfile.employeeDetails.physicalAddress!;
    this.initializeForm();
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
