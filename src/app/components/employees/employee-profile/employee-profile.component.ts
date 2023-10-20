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
import { FieldCode } from 'src/app/models/field-code.interface';
import { FieldCodeService } from 'src/app/services/field-code.service';
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
  CustomFields: FieldCode[] = [];

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
  
  editContact: boolean = false;
  editEmployee: boolean = false;
  editPersonal: boolean = false;
  editAddress: boolean = false;

  physicalCountryControl : string = "";
  postalCountryControl : string = "";
  

  filteredCountries: any[] = this.countries.slice();
  constructor(private accessPropertyService: AccessPropertiesService,
    private cookieService: CookieService,
    private employeeProfileService: EmployeeProfileService,
    private employeeAddressService: EmployeeAddressService,
    private customFields : FieldCodeService) { }

  ngOnInit() {
    this.getEmployeeFields();
    this.races = race;
    this.genders = gender;
    this.sizes = tshirtSize;
    this.countries = countries;
    this.disabilities = disabilities;
    this.provinces = provinces;
  }

  getEmployeeFields() {
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
        this.customFields.getAllFieldCodes().subscribe({
          next: data => {
            this.CustomFields = data;
          }
        });
      }
    });
  }
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

  setHasDisability(event: any) {
    this.hasDisbility = event.value;
  }
 
  editPersonalDetails() {
    this.editPersonal = true;
  }

  savePersonalEdit() {
    this.editPersonal = false;
  }


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

  saveAddressEdit() {
    this.editAddress = false;
  }

  cancelAddressEdit() {
    this.editAddress = false;
    this.hasDisbility = false;
    this.physicalCountryControl = this.postalCountryControl = "";
  }

  editEmployeeDetails(){
    this.editEmployee = true;
  }

  saveEmployeeEdit(){
    this.editEmployee = false;
  }

  cancelEmployeeEdit(){
    this.editEmployee = false;
  }

  editContactDetails(){
    this.editContact = true;
  }

  saveContactEdit(){
    this.editContact = false;
  }

  cancelContactEdit(){
    this.editContact = false;
  }

}