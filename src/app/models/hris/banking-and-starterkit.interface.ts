import { EmployeeBanking } from "./employee-banking.interface";
import { EmployeeDocument } from "./employeeDocument.interface";

export interface BankingAndStarterKit {
    employeeBankingDto: EmployeeBanking;
    employeeDocumentDto: EmployeeDocument;
    name: string | null;
    surname: string | null;
    employeeId: number;
}
