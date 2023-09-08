import { EmployeeType } from "./employee-type.model";

export class NewEmployee {

    constructor(){
        this.name = "";
        this.surname = "";
        this.email = "";
        this.personalEmail = "";
        this.engagementDate = new Date();
        this.employeeType = undefined;
        
    }

    name : string;
    surname : string;
    email: string;
    personalEmail: string;
    engagementDate : Date;
    employeeType?: EmployeeType;
}
