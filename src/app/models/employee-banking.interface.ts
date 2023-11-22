import { EmployeeProfile } from "./employee-profile.interface"
export interface EmployeeBanking{
    id: number,
    employee: EmployeeProfile,
    bankName: string,
    branch: string,
    accountNo: string,
    accountType: number,
    accountHolderName: string,
    status: number,
    declineReason: string,
    file: string,
    lastUpdateDate?: Date,
    pendingUpdateDate?: Date
}