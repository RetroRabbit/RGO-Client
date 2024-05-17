import { EmployeeProfile } from "./employee-profile.interface";

export interface WorkExperience {
    id: number,
    title: string,
    employementType: string,
    companyName: string,
    location: string,
    startDate: Date | string,
    endDate: Date | string,
    employeeId?: EmployeeProfile
}