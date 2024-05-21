export interface EmployeeQualifications {
    id : number;
    employeeId?: number,
    highestQualification: number,
    school: string | null,
    fieldOfStudy: string | null,
    year: string | null,
    nqfLevel: { id: number; value: string; }[],
}