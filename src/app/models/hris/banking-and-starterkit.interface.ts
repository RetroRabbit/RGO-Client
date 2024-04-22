import { EmployeeBanking } from "./employee-banking.interface";
import { EmployeeDocument } from "./employeeDocument.interface";

export interface BankingAndStarterKitDto {
    employeeBankingDto: EmployeeBanking;
    employeeDocumentDto: EmployeeDocument;
    name: string | null;
    surname: string | null;
    employeeId: number;
}