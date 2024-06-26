export class EmployeeQualifications {

    constructor() {
        this.id = 0;
        this.employeeId = 0;
        this.highestQualification = 0;
        this.school = '';
        this.fieldOfStudy = '';
        this.year = '';
        this.nqfLevel = [];
        this.proofOfQualification = '';
        this.documentName = '';
    }

    id : number;
    employeeId: number;
    highestQualification: number;
    school: string;
    fieldOfStudy: string;
    year: string;
    nqfLevel: { id: number; value: string; }[];
    proofOfQualification: string;
    documentName: string;
}