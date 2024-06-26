export class EmployeeTermination {

    constructor() {
        this.id = 0;
        this.employeeId = 0;
        this.terminationOption = 0;
        this.dayOfNotice = '';
        this.lastDayOfEmployment = '';
        this.reemploymentStatus = false;
        this.equipmentStatus = false;
        this.accountsStatus = false;
        this.terminationDocument = '';
        this.documentName = '';
        this.terminationComments = '';
    }

    id: number;
    employeeId: number;
    terminationOption: number;
    dayOfNotice: string;
    lastDayOfEmployment: string;
    reemploymentStatus: boolean;
    equipmentStatus: boolean;
    accountsStatus: boolean;
    terminationDocument: string;
    documentName: string;
    terminationComments: string;
}