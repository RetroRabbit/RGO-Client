export interface EmployeeTermination {
    id: number,
    employeeId: number,
    terminationOption: number,
    dayOfNotice: string,
    lastDayOfEmployment: string,
    reemploymentStatus: boolean,
    equipmentStatus: boolean,
    accountsStatus: boolean,
    terminationDocument: string,
    documentName: string,
    terminationComments: string
}