import { EmployeeProfile } from "./employee-profile.interface"
export interface EmployeeDocument {
    id: number,
    employeeId: number,
    fileName: string,
    file: string,
    uploadDate: Date,
}
