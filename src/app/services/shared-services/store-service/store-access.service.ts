import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/components/shared-components/store/app.state';
import { selectClients } from 'src/app/components/shared-components/store/selector/client.selector';
import { Client } from 'src/app/models/hris/client.interface';
import { selectCustomField } from 'src/app/components/shared-components/store/selector/custom-field.selector';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { selectEmployeeProfileDetails } from 'src/app/components/shared-components/store/selector/employee-profile-details.selector';
import { EmployeeProfileDetails } from 'src/app/models/hris/EmployeeProfile/employeeProfileDetails.interface';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { selectEmployeeProfiles } from 'src/app/components/shared-components/store/selector/employee-profile.selector';

@Injectable({
  providedIn: 'root',
})
export class StoreAccessService {
  public constructor(
    private store: Store<AppState>,
  ) { }

  getClients(): Client[] {
    let clients: Client[] = [];
    this.store.select(selectClients).subscribe((store) => {
      clients = store || '';
    });
    return clients;
  }

  getFieldCodes(): CustomField[] {
    let customField: CustomField[] = [];
    this.store.select(selectCustomField).subscribe((store) => {
      customField = store || '';
    });
    return customField;
  }

  getEmployeeProfileDetails(): EmployeeProfileDetails[] {
    let employeeProfileDetails: EmployeeProfileDetails[] = [];
    this.store.select(selectEmployeeProfileDetails).subscribe((store) => {
      employeeProfileDetails = store || '';
    });
    return employeeProfileDetails;
  }

  // Temporary usage until backend merged, need to use getEmployeeProfileDetails()
  // and remove all boiler plate code for ngrx
  getEmployeeProfiles(): EmployeeProfile[] {
    let employeeProfiles: EmployeeProfile[] = [];
    this.store.select(selectEmployeeProfiles).subscribe((store) => {
      employeeProfiles = store || '';
    });
    return employeeProfiles;
  }

}