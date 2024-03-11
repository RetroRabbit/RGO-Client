
import { AccessPropertiesService } from "./access-properties.service";
import { PropertyAccessLevel } from "../../models/hris/constants/enums/property-access-levels.enum";
import { Injectable } from "@angular/core";
import { EmployeeProfilePermissions } from "../../models/hris/property-access/employee-profile-properties.interface";
import { EmployeeAddressPermissions } from "../../models/hris/property-access/employee-address-properties.interface";
import { AuthAccessService } from "../shared-services/auth-access/auth-access.service";
import { PropertyAccess } from "src/app/models/hris/properties.interface";

@Injectable({
    providedIn: 'root'
})

export class SharedPropertyAccessService {
    userId = this.authAccessService.getUserId();
    accessProperties!: PropertyAccess[];

    public employeeProfilePermissions: EmployeeProfilePermissions = {
        id: true,
        employeeNumber: true,
        taxNumber: true,
        engagementDate: true,
        terminationDate: true,
        peopleChampion: true,
        disability: true,
        disabilityNotes: true,
        countryOfBirth: true,
        nationality: true,
        level: true,
        employeeType: true,
        name: true,
        initials: true,
        surname: true,
        dateOfBirth: true,
        idNumber: true,
        passportNumber: true,
        passportExpirationDate: true,
        passportCountryIssue: true,
        race: true,
        gender: true,
        email: true,
        personalEmail: true,
        cellphoneNo: true,
        photo: true,
        notes: true,
        leaveInterval: true,
        salaryDays: true,
        payRate: true,
        salary: true,
        clientAllocated: true,
        teamLead: true,
        physicalAddress: true,
        postalAddress: true,
        houseNo: true,
        emergencyContactName: true,
        emergencyContactNo: true
    };

    public employeeAddressPermissions: EmployeeAddressPermissions = {
        id: true,
        unitNumber: true,
        complexName: true,
        streetNumber: true,
        suburbOrDistrict: true,
        city: true,
        country: true,
        province: true,
        postalCode: true
    }

    constructor(
        private accessPropertiesService: AccessPropertiesService,
        private authAccessService: AuthAccessService,
    ) { }

    public checkPermission(tablename: string, fieldname: string): PropertyAccessLevel {
        const matchingAccess = this.accessProperties.find(access => access.table === tablename && access.field === fieldname);
        return matchingAccess ? matchingAccess.accessLevel : PropertyAccessLevel.write;
    }

    public setAccessProperties() {
        this.accessPropertiesService.FetchUserId(this.authAccessService.getEmployeeEmail()).subscribe({
            next: (userId) => {
                this.userId = userId;
                this.accessPropertiesService.GetAccessProperties(userId).subscribe({
                    next: (accessProperties) => {
                        this.accessProperties = accessProperties;
                    }
                });
            }
        });
    }
}