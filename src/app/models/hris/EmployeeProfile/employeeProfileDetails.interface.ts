import { EmployeeType } from "./employeeType.interface";

export interface EmployeeProfileDetails {
    id: number;
    engagementDate: string;
    peopleChampionId: number;
    peopleChampionName: string;
    level: number;
    employeeType: EmployeeType;
    name: string;
    initials: string;
    surname: string;
    dateOfBirth: string;
    idNumber: string;
    clientAllocatedId: number | null;
    clientAllocatedName: string | null;
    teamLeadId: number | null;
    teamLeadName: string;
}