import { EmployeeBanking } from "../employee-banking.interface";
import { EmployeeData } from "../employee-data.interface";
import { EmployeeProfileSalary } from "./employeeProfileSalaryDetails.interface";

export interface employeeProfileBanking {
    employeeSalary : EmployeeProfileSalary,
    employeeBanking : EmployeeBanking,
    employeedata : EmployeeData
}