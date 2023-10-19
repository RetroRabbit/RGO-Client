import { EmployeeProfile } from "./employee-profile.interface"

export interface Address{
    id : number,
    employee : EmployeeProfile,
    adressType : any,
    unitNumber : string,
    complexNumber : string,
    streetNumber : string,
    streetName : string,
    suburb : string,
    city : string,
    postalCode : string

}