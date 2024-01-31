export interface EmployeeDocument {
    id: number,
    employeeId: number,
    reference: string,
    fileName: string,
    fileCategory: number,
    file: string,
    uploadDate: Date,
    reason: string,
    status : number
}
