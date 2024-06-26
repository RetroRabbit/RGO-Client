import { EmployeeAddress } from "./employee-address.interface";
import { EmployeeQualifications } from "./employee-qualifications.interface";
import { EmployeeType } from "./employee-type.model";

export class EmployeeProfile { 

  constructor() {
    this.id = 0;
    this.employeeNumber = '';
    this.taxNumber = '';
    this.engagementDate = new Date();
    this.terminationDate = new Date();
    this.peopleChampion = 0;
    this.disability = false;
    this.disabilityNotes = '';
    this.countryOfBirth = '';
    this.nationality = '';
    this.level = 0;
    this.employeeType = new EmployeeType();
    this.name = '';
    this.initials = '';
    this.surname = '';
    this.dateOfBirth = new Date();
    this.idNumber = '';
    this.email = '';
    this.personalEmail = '';
    this.passportCountryIssue = '';
    this.cellphoneNo = '';
    this.active = true;   
  }

  id: number;
  employeeNumber: string;
  taxNumber: string;
  engagementDate: Date;
  terminationDate?: Date;
  peopleChampion?: number;
  disability: boolean = false;
  disabilityNotes?: string;
  countryOfBirth?: string;
  nationality?: string;
  level: number;
  employeeType: EmployeeType;
  name: string;
  initials: string;
  surname: string;
  dateOfBirth: Date;
  idNumber: string;
  passportNumber?: string;
  passportExpirationDate?: Date;
  passportCountryIssue?: string;
  race?: number;
  gender?: number;
  email: string;
  personalEmail: string;
  cellphoneNo: string;
  photo?: string;
  notes?: string;
  leaveInterval?: number;
  salaryDays?: number;
  payRate?: number;
  salary?: Number;
  clientAllocated?: number;
  teamLead?: number;
  physicalAddress?: EmployeeAddress;
  postalAddress?: EmployeeAddress;
  houseNo?: string;
  emergencyContactName?: string;
  emergencyContactNo?: string;
  qualifications?: EmployeeQualifications;
  active: boolean;
  inactiveReason?: string;
}