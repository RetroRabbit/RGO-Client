import { Employee } from "./employee.interface"

export interface EmployeeBanking{
    id: number,
    employee: Employee,
    bankName: string,
    branch: string,
    accountNo: string,
    accountType: number,
    accountHolderName: string,
    status: number
}