import { Certificate } from "tls"
import { WorkExperience } from "../work-experience.interface"
import { EmployeeProfileDetails } from "./employeeProfileDetails.interface";
import { EmployeeProfilePersonal } from "./employeePersonalDetails.interface";
import { EmployeeProfileSalary } from "./employeeProfileSalaryDetails.interface";
import { EmployeeAddress } from "../employee-address.interface";
import { EmployeeQualifications } from "../employee-qualifications.interface";
import { EmployeeBanking } from "../employee-banking.interface";
import { EmployeeProfileContact } from "./employeeContactDetails.interface";


export interface EmployeeProfileNew {
    employeeProfileDetails?: EmployeeProfileDetails;
    employeeProfilePersonal?: EmployeeProfilePersonal;
    employeeProfileContact?: EmployeeProfileContact;
    employeeProfileSalary?: EmployeeProfileSalary;
    employeeData: any; // Assuming it's nullable or has its own interface
    employeeQualification?: EmployeeQualifications;
    workExperience: WorkExperience[];
    employeeCertifications: Certificate[];
    employeeBanking: EmployeeBanking[];
    authUserId: string | null;
    employeeNumber: string;
    terminationDate: string | null;
    notes: string;
    passportNumber: string;
    passportExpirationDate: string | null;
    passportCountryIssue: string;
    photo: string;
    active: boolean;
    inactiveReason: string | null;
    physicalAddress?: EmployeeAddress;
}
