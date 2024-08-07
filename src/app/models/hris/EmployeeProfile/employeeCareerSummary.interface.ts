import { EmployeeCertificates } from "../employee-certificates.interface";
import { EmployeeData } from "../employee-data.interface";
import { EmployeeSalary } from "../employee-salary.interface";
import { WorkExperience } from "../work-experience.interface";
import { EmployeeQualificationDto } from "./employeeQualification.interface";

export interface EmployeeCareerSummary {
    employeeProfileSalary : EmployeeSalary,
    employeeQualifications : EmployeeQualificationDto,
    employeeWorkexperience : WorkExperience,
    employeecertificates : EmployeeCertificates,
    employeeData : EmployeeData
}