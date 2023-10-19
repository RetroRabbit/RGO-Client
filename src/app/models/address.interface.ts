import { EmployeeProfile } from "./employee-profile.interface"

export interface Address{
    id : number,
    employee : EmployeeProfile,
    adressType : any,
    unitNumber : string,
    complexName : string,
    country : string,
    streetNumber : string,
    streetName : string,
    suburb : string,
    city : string,
    postalCode : string,
    province: string

}