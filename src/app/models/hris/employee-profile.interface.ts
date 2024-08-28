import { EmployeeAddress } from "./employee-address.interface";
import { EmployeeQualifications } from "./employee-qualifications.interface";

export class EmployeeProfile {

  EmployeeProfile() { }
  authUserId!: string;
  id!: number;
  employeeNumber?: string;
  taxNumber?: string;
  engagementDate?: Date;
  terminationDate?: Date;
  peopleChampionName?: string;
  peopleChampionId?: number;
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
  clientAllocatedName?: string;
  clientAllocatedId?: number;
  teamLeadName?: string;
  teamLeadId?: number;
  houseNo?: string;
  emergencyContactName?: string;
  emergencyContactNo?: string;
  physicalAddress?: EmployeeAddress;
  qualifications?: EmployeeQualifications;
  active?: boolean;
  inactiveReason?: string;
}
