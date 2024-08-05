import { EmployeeAddress } from "../employee-address.interface";
import { EmployeeData } from "../employee-data.interface";
import { EmployeeSalary } from "../employee-salary.interface";
import { EmployeeProfileContact } from "./employeeContactDetails.interface";
import { EmployeePersonalDetails } from "./employeePersonalDetails.interface";

export interface EmployeeProfileDetails {
   employeeDetails : EmployeeProfileDetails,
   personalDetails : EmployeePersonalDetails,
   contactDetails : EmployeeProfileContact,
   employeeProfileSalary : EmployeeSalary,
   employeeData: EmployeeData,
   photo: string;
   active: boolean;
   inactiveReason: string | null;
   terminationDate: string | null;
   physicalAddress? : EmployeeAddress,
}