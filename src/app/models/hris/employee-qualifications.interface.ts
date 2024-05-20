export interface EmployeeQualifications {
    id : number;
    employeeId?: number;
    highestQualification?: number ,
    school?: string ,
    degree?: string ,
    fieldOfStudy?: string,
    year?: Date["getUTCDate"],
    nqfLevel?: number,
}