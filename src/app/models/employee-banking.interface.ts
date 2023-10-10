import { Employee } from "./employee.interface"
export interface EmployeeBanking{
    id: number,
    employee: any,
    bankName: string,
    branch: string,
    accountNo: string,
    accountType: number,
    accountHolderName: string,
    status: number
}