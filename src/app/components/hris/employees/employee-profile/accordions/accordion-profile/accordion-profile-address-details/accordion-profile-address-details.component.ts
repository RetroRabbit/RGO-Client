import { Component, HostListener, Input } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeAddressService } from 'src/app/services/hris/employee/employee-address.service';
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
  provinces: string[] = [];
  countries: string[] = [];
  cities: string[] = [];
  selectedCountry: string = '';
  selectedProvince: string = '';
  selectedPostalCountry: string = '';
  selectedPostalProvince: string = '';
  editAddress: boolean = false;
  employeeAddress!: EmployeeAddress;
  currentEmployeeId: number = -1;
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile }

  constructor(
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private employeeAddressService: EmployeeAddressService,
    public locationApiService: LocationApiService,
    public navService: NavService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.currentEmployeeId = this.route.snapshot.params['id'] ?? this.authAccessService.getUserId();
    this.loadPhysicalAddress();
    await this.initializeForm();
    this.getEmployeeFields();
  }

  async initializeForm() {
    if (this.employeeAddress) {
      this.sharedAccordionFunctionality.addressDetailsForm = this.fb.group({
        physicalUnitNumber: [this.employeeAddress?.unitNumber, [Validators.pattern(/^[0-9]*$/)]],
        physicalComplexName: [this.employeeAddress?.complexName],
        physicalStreetNumber: [this.employeeAddress?.streetNumber, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        physicalStreetName: [this.employeeAddress?.streetName, Validators.required],
        physicalCity: [this.employeeAddress?.city, Validators.required],
        physicalSuburb: [this.employeeAddress?.suburbOrDistrict],
        physicalCountry: [this.employeeAddress?.country, Validators.required],
        physicalProvince: [this.employeeAddress?.province, Validators.required],
        physicalPostalCode: [this.employeeAddress?.postalCode, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(4), Validators.minLength(4)]],
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
    this.sharedAccordionFunctionality.employeePhysicalAddress = this.employeeAddress;
    this.sharedAccordionFunctionality.addressDetailsForm.disable();
    this.sharedAccordionFunctionality.checkAddressFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();
    await this.sharedPropertyAccessService.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls), "Employee", true , this.sharedAccordionFunctionality.addressDetailsForm , this.employeeProfile.employeeDetails.email!)
  }

  saveAddressEdit() {
    if (this.sharedAccordionFunctionality.addressDetailsForm.valid) {
      const addressDetailFormValue = this.sharedAccordionFunctionality.addressDetailsForm.value;
      const physicalAddressDto: EmployeeAddress = {
        id: this.employeeAddress ? this.employeeAddress.id : 0,
        employeeId: this.currentEmployeeId,
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
        this.selectedCountry = this.employeeAddress?.country || '';
        if (!this.selectedCountry.trim()) {
          return;
        }
        this.locationApiService.getProvinces(this.selectedCountry).subscribe({
          next: (data) => {
            if (!data || data.length === 0) {
              return;
            }
            this.provinces = data;
            this.selectedProvince = this.employeeAddress?.province || '';
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
    if (this.currentEmployeeId == undefined) {
      this.employeeAddressService.GetEmployeeAddressById(this.currentEmployeeId as number).subscribe({
        next: (data) => {
          this.employeeAddress = data;
          this.initializeForm();
        },
        error: (er) => this.snackBarService.showError(er),
      });
    } else {
      this.employeeAddressService.GetEmployeeAddressById(this.currentEmployeeId).subscribe({
        next: (data) => {
          this.employeeAddress = data;
          this.initializeForm();
        },
        error: (er) => {
          throw er;
        },
      });
    }
  }

  async editAddressDetails() {
    this.editAddress = true;
    this.sharedAccordionFunctionality.addressDetailsForm.enable();
    await this.sharedPropertyAccessService.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.addressDetailsForm.controls), "Employee", false , this.sharedAccordionFunctionality.addressDetailsForm , this.employeeProfile.employeeDetails.email!)

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
}
