import { EmployeeProfile } from "./employee-profile.interface";

export interface WorkExperience {
    id: number,
    clientName: string,
    projectName: string,
    skillSet?: string[],
    software?: string[],
    startDate: Date,
    endDate: Date,
    employeeId: number
}