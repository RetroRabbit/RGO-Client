export interface EmployeeQualifications {
    id : number;
    employeeId: number,
    highestQualification: number,
    school: string,
    fieldOfStudy: string,
    year: string,
    nqfLevel: { id: number; value: string; }[],
    proofOfQualification: ArrayBuffer,
    documentName: string
}