
import { AccessPropertiesService } from "./access-properties.service";
import { PropertyAccessLevel } from "../../models/hris/constants/enums/property-access-levels.enum";
import { Injectable } from "@angular/core";
import { EmployeeProfilePermissions } from "../../models/hris/property-access/employee-profile-properties.interface";
import { EmployeeAddressPermissions } from "../../models/hris/property-access/employee-address-properties.interface";
import { AuthAccessService } from "../shared-services/auth-access/auth-access.service";
import { PropertyAccess } from "src/app/models/hris/properties.interface";
import { lastValueFrom } from 'rxjs'; 
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class SharedPropertyAccessService {
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
        houseNo: true,
        emergencyContactName: true,
        emergencyContactNo: true,
        highestQualification: true,
        school: true,
        degree: true,
        fieldOfStudy: true,
        year: true,
        nqfLevel: true,
        proofOfQualification: true,
        downloadDocument: true,
        addAnotherQualification: true,
        editQualification: true,
    };

    public employeeAddressPermissions: EmployeeAddressPermissions = {
        id: true,
        employeeId: true,
        unitNumber: true,
        complexName: true,
        streetNumber: true,
        streetName: true,
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

    public async setAccessProperties(email: string): Promise<void> {
        try {
            const userId = await lastValueFrom(this.accessPropertiesService.FetchUserIdByEmail(email));
            this.authAccessService.setUserId(userId);
            this.accessProperties = await lastValueFrom(this.accessPropertiesService.GetAccessProperties(userId));
        } catch (error) {
        }
    }

    // checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean, formGroup : FormGroup): void {
    //     this.setAccessProperties(email goes here);
    //     console.log("perms", fieldNames, table , initialLoad )
    //     if (!this.accessProperties) {
    //       return;
    //     }
    //     fieldNames.forEach(fieldName => {
    //       let control: AbstractControl<any, any> | null = null;
    //       control = formGroup.get(fieldName);
    
    //       if (control) {
    //         switch (this.sharedPropertyAccessService.checkPermission(table, fieldName)) {
    //           case PropertyAccessLevel.none:
    //             if (!initialLoad)
    //               control.disable();
    //             this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = false;
    //             break;
    //           case PropertyAccessLevel.read:
    //             if (!initialLoad)
    //               control.disable();
    //             this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = true;
    //             break;
    //           case PropertyAccessLevel.write:
    //             if (!initialLoad)
    //               control.enable();
    //             this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = true;
    //             break;
    //           default:
    //             if (!initialLoad)
    //               control.enable();
    //         }
    //       }
    //     });
    //   }
}