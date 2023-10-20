import { Component } from '@angular/core';
import { AccessPropertiesService } from 'src/app/services/access-properties.service';
import { Properties } from 'src/app/models/properties.interface';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
import { race } from 'src/app/models/constants/race.constants';
import { gender } from 'src/app/models/constants/gender.constants';
import { tshirtSize } from 'src/app/models/constants/tshirt.constants';
import { countries } from 'src/app/models/constants/country.constants';
import { disabilities } from 'src/app/models/constants/disabilities.constant';
import { provinces } from 'src/app/models/constants/provinces.constants';
import { Address } from 'src/app/models/address.interface';
import { EmployeeAddressService } from 'src/app/services/employee/employee-address.service';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  EmployeeFields: Properties[] = [];
  EditFields: Properties[] = [];
  EmployeeProfile !: EmployeeProfile;
  EmployeeAddress !: Address;

  isEdit: boolean = false;
  selectedItem: string = 'Profile Details'; // set the default accordion to Profile Details
  expandedIndex = 0;
  panelOpenState: boolean = false;
  races: any[] = [];
  genders: any[] = [];
  sizes: any[] = [];
  countries: any[] = [];
  hasDisbility: boolean = false;
  disabilities: any[] = [];
  provinces: any[] = [];
  physicalEqualPostal: boolean = false;

  editPersonal: boolean = false;
  editAddress: boolean = false;

  physicalCountryControl : string = "";
  postalCountryControl : string = "";
  filteredCountries: any[] = this.countries.slice();
  constructor(private accessPropertyService: AccessPropertiesService,
    private cookieService: CookieService,
    private employeeProfileService: EmployeeProfileService,
    private employeeAddressService: EmployeeAddressService) { }

  ngOnInit() {
    this.getEmployeeFields();
    // populating constants
    this.races = race;
    this.genders = gender;
    this.sizes = tshirtSize;
    this.countries = countries;
    this.disabilities = disabilities;
    this.provinces = provinces;
  }

  getEmployeeFields() {
    // get the employee data
    this.accessPropertyService.GetAccessProperties(this.cookieService.get('userEmail')).subscribe({
      next: data => {
        this.EmployeeFields = data;
      }
    });
    this.employeeProfileService.GetEmployeeProfile().subscribe({
      next: data => {
        this.EmployeeProfile = data;
        this.employeeAddressService.get(this.EmployeeProfile.id).subscribe({
          next: data => {
            this.EmployeeAddress = data;
          },
          error: (error) => console.log(error)
        })
      }
    });
  }
  // This is for the accordion nav 
  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.selectedItem = target.innerText;
  }

  filterCountries(value: any) {
    const filterValue = value.target.value.toLowerCase();
    this.filteredCountries = this.countries.filter(
      (country) => country.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredCountries);
  }

  // Setting the bool for conditional rendering
  setHasDisability(event: any) {
    this.hasDisbility = event.value;
  }
  // When they click on the edit button
  editPersonalDetails() {
    this.editPersonal = true;
  }
  // Does nothing for now
  savePersonalEdit() {
    this.editPersonal = false;
  }

  // Grey out the values is cancelling an edit
  cancelPersonalEdit() {
    this.editPersonal = false;
    this.hasDisbility = false;
  }

  setPhysicalEqualPostal(event: any) {
    console.log(this.physicalEqualPostal);
  }

  editAddressDetails() {
    this.editAddress = true;
  }
  // Does nothing for now
  saveAddressEdit() {
    this.editAddress = false;
  }

  // Grey out the values is cancelling an edit
  cancelAddressEdit() {
    this.editAddress = false;
    this.hasDisbility = false;
    this.physicalCountryControl = this.postalCountryControl = "";
  }
}

/*
  The css properties should apply to reusable as along as the id or class relates with what is in the file
*/
