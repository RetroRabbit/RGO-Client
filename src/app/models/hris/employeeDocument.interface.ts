export interface EmployeeDocument {
    id: number,
    employeeId: number,
    reference: string,
    fileName: string,
    fileCategory: number,
    blob: string,
    uploadDate: Date,
    reason: string,
    status: number,
    counterSign: boolean,
    lastUpdatedDate: Date
}
