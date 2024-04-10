export interface EmployeeAddress {
    id: number;
    unitNumber: string | null;
    complexName: string | null;
    streetName: string | null;
    streetNumber: string | null;
    suburbOrDistrict: string | null;
    city: string | null;
    country: string | null;
    province: string | null;
    postalCode: string | null;
}