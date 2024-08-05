import { EmployeeAddress } from "../employee-address.interface";
import { EmployeeData } from "../employee-data.interface";
import { EmployeeProfileContact } from "./employeeContactDetails.interface";
import { EmployeeDetails } from "./employeeDetails.interface";
import { EmployeePersonalDetails } from "./employeePersonalDetails.interface";

export interface EmployeeProfileDetails {
   employeeDetails : EmployeeDetails,
   personalDetails : EmployeePersonalDetails,
   contactDetails : EmployeeProfileContact,
   employeeData: EmployeeData,
   photo: string;
   active: boolean;
   physicalAddress? : EmployeeAddress,
}