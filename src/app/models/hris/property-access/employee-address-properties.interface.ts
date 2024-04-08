export interface EmployeeAddressPermissions {
    id: boolean;
    unitNumber: boolean;
    complexName: boolean;
    streetName: boolean;
    streetNumber: boolean;
    suburbOrDistrict: boolean;
    city: boolean;
    country: boolean;
    province: boolean;
    postalCode: boolean,
    [key: string]: boolean;
}