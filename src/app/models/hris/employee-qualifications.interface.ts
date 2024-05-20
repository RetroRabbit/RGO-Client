export interface EmployeeQualifications {
    id : number;
    employeeId?: number,
    highestQualification: number,
    school: string | null,
    degree: string | null,
    fieldOfStudy: string | null,
    yearObtained: string | null,
    nqfLevel: number,
}