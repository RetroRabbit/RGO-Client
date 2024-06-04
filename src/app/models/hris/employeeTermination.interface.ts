export interface EmployeeTermination {
    id: number,
    employeeId: number,
    terminationOption: number,
    dayOfNotice: Date,
    lastDayOfEmployment: Date,
    reemploymentStatus: boolean,
    equipmentStatus: boolean,
    accountsStatus: boolean,
    terminationDocument: string,
    documentName: string,
    terminationComments: string
}