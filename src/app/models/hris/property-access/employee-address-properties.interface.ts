export interface EmployeeAddressPermissions {
    id: boolean;
    employeeId: boolean;
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