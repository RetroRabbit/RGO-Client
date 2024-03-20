import { Injectable } from '@angular/core';
import { Client } from 'src/app/models/hris/client.interface';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';
import { levels } from 'src/app/models/hris/constants/levels.constants';
import { races } from 'src/app/models/hris/constants/races.constants';
import { genders } from 'src/app/models/hris/constants/genders.constants';
import { countries } from 'src/app/models/hris/constants/countries.constants';
import { disabilities } from 'src/app/models/hris/constants/disabilities.constant';
import { provinces } from 'src/app/models/hris/constants/provinces.constants';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { FieldCode } from 'src/app/models/hris/field-code.interface';
import { category } from 'src/app/models/hris/constants/fieldcodeCategory.constants';
import { dataTypes } from 'src/app/models/hris/constants/types.constants';

@Injectable({
  providedIn: 'root'
})
export class SharedAccordionFunctionality {

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



  totalProfileProgress() {
    //   this.profileFormProgress = Math.floor((this.employeeFormProgress + this.personalFormProgress + this.contactFormProgress + this.addressFormProgress + this.additionalFormProgress) / 5);
    //   this.updateProfile.emit(this.profileFormProgress);
  }



}
