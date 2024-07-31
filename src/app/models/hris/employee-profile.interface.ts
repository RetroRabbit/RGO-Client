import { EmployeeAddress } from "./employee-address.interface";
import { EmployeeQualifications } from "./employee-qualifications.interface";

export class EmployeeProfile { 

  EmployeeProfile() {}
  id!: number;
  employeeNumber?: string;
  taxNumber?: string;
  engagementDate?: Date;
  terminationDate?: Date;
  peopleChampion?: number;
  disability?: boolean;
  disabilityType?: number;
  disabilityNotes?: string;
  countryOfBirth?: string;
  nationality?: string;
  level?: number;
  employeeType?: {
    id?: number,
    name?: string,
  };
  
  name?: string;
  initials?: string;
  surname?: string;
  dateOfBirth?: Date;
  idNumber?: string;
  passportNumber?: string;
  passportExpirationDate?: Date;
  passportCountryIssue?: string;
  race?: number;
  gender?: number;
  email?: string;
  personalEmail?: string;
  cellphoneNo?: string;
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
  active?: boolean;
  inactiveReason?: string;
}