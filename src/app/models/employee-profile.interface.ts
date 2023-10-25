import { EmployeeAddress } from "./employee-address.interface";

export interface EmployeeProfile {
  id: number,
  employeeNumber: string,
  taxNumber: string,
  engagementDate: Date,
  terminationDate: Date,
  peopleChampion?: number,
  disability: boolean,
  disabilityNotes: string,
  countryOfBirth: string,
  nationality: string,
  level: number,
  employeeType: {
    id: number,
    name: string,
  },
  title: string,
  name: string,
  initials: string,
  surname: string,
  dateOfBirth: Date,
  idNumber: string,
  passportNumber?: string,
  passportExpirationDate?: Date,
  passportCountryIssue?: string,
  race: number,
  gender: number,
  email: string,
  personalEmail: string,
  cellphoneNo: string,
  photo : string, 
  notes: string, 
  leaveInterval: number,
  salaryDays: number, 
  payRate: number, 
  salary: Number,
  clientAllocated?: string,
  teamLead?: number,
  physicalAddress?: EmployeeAddress,
  postalAddress?: EmployeeAddress,
}