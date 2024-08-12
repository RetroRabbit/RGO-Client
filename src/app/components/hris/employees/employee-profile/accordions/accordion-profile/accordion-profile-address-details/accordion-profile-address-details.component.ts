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
  country: any;
  province: any;
  city: any;
  streetNumber: string = '';
  streetName: string = '';
  streetcode: string = '';
  editAddress: boolean = false;
  employeeAddress!: EmployeeAddress;
  currentEmployeeId: number | undefined;



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

    this.currentEmployeeId = this.route.snapshot.params["id"];
    this.loadPhysicalAddress();
    this.initializeForm();
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.getEmployeeFields();
  }

  initializeForm() {

    if (this.sharedAccordionFunctionality.employeePhysicalAddress) {
      this.sharedAccordionFunctionality.addressDetailsForm = this.fb.group({
        physicalUnitNumber: [this.sharedAccordionFunctionality.employeePhysicalAddress?.unitNumber, [Validators.pattern(/^[0-9]*$/)]],
        physicalComplexName: [this.sharedAccordionFunctionality.employeePhysicalAddress?.complexName],
        physicalStreetNumber: [this.sharedAccordionFunctionality.employeePhysicalAddress?.streetNumber, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        physicalStreetName: [this.sharedAccordionFunctionality.employeePhysicalAddress?.streetName, Validators.required],
        physicalCity: [this.sharedAccordionFunctionality.employeePhysicalAddress?.city, Validators.required],
        physicalSuburb: [this.sharedAccordionFunctionality.employeePhysicalAddress?.suburbOrDistrict],
        physicalCountry: [this.sharedAccordionFunctionality.employeePhysicalAddress?.country, Validators.required],
        physicalProvince: [this.sharedAccordionFunctionality.employeePhysicalAddress?.province, Validators.required],
        physicalPostalCode: [this.sharedAccordionFunctionality.employeePhysicalAddress?.postalCode, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(4), Validators.minLength(4)]],
      });
    }
    else {
      this.sharedAccordionFunctionality.addressDetailsForm = this.fb.group({
        physicalUnitNumber: [null, [Validators.pattern(/^[0-9]*$/)]],
        physicalComplexName: [null],
        physicalStreetNumber: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        physicalStreetName: [null, Validators.required],
        physicalCity: [null, Validators.required],
        physicalSuburb: [null],
        physicalCountry: [null, Validators.required],
        physicalProvince: [null, Validators.required],
        physicalPostalCode: [null, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(4), Validators.minLength(4)]],
      });
    }

    this.sharedAccordionFunctionality.addressDetailsForm.disable();
    this.sharedAccordionFunctionality.checkAddressFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls), "EmployeeAddress", true)
  }

  saveAddressEdit() {
    if (this.sharedAccordionFunctionality.addressDetailsForm.valid) {
      const addressDetailFormValue = this.sharedAccordionFunctionality.addressDetailsForm.value;

      const physicalAddressDto: EmployeeAddress = {
        id: this.sharedAccordionFunctionality.employeePhysicalAddress ? this.sharedAccordionFunctionality.employeePhysicalAddress.id : 0,
        employeeId: this.currentEmployeeId != undefined ? this.currentEmployeeId : this.navService.employeeProfile.id!,
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

      if (this.sharedAccordionFunctionality.employeePhysicalAddress) {
        this.employeeAddressService.update(physicalAddressDto).subscribe({
          next: () => {
            this.snackBarService.showSnackbar("Updated", "snack-success");
            this.editAddress = false;
            this.getEmployeeFields();
          },
          error: (er) => this.snackBarService.showError(er)
        })
      } else {
        this.employeeAddressService.save(physicalAddressDto).subscribe({
          next: () => {
            this.snackBarService.showSnackbar("Saved", "snack-success");
            this.editAddress = false;
            this.getEmployeeFields();
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
        this.selectedCountry = this.sharedAccordionFunctionality.employeePhysicalAddress?.country || '';
        if (!this.selectedCountry.trim()) {
          return;
        }
        this.locationApiService.getProvinces(this.selectedCountry).subscribe({
          next: (data) => {
            if (!data || data.length === 0) {
              return;
            }
            this.provinces = data;
            this.selectedProvince = this.sharedAccordionFunctionality.employeePhysicalAddress?.province || '';
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
    const currentEmployeeId = this.currentEmployeeId != undefined ? this.currentEmployeeId : this.navService.employeeProfile.id
    this.employeeAddressService.GetEmployeeAddressById(currentEmployeeId).subscribe({
      next: (data) => {
        this.sharedAccordionFunctionality.employeePhysicalAddress = data;
        this.initializeForm();
      },
      error: (er) => this.snackBarService.showError(er),
    });
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
