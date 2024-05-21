export interface EmployeeDocument {
    id: number,
    employeeId: number,
    reference: string,
    fileName: string,
    fileCategory: number,
    employeeFileCategory: number,
    adminFileCategory: number,
    blob: string,
    uploadDate: Date,
    reason: string,
    status: number,
    counterSign: boolean,
    documentType: number,
    lastUpdatedDate: Date
}
