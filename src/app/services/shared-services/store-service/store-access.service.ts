import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/components/shared-components/store/app.state';
import { selectClients } from 'src/app/components/shared-components/store/selector/client.selector';
import { Client } from 'src/app/models/hris/client.interface';
import { selectCustomField } from 'src/app/components/shared-components/store/selector/custom-field.selector';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { selectEmployeeProfileDetails } from 'src/app/components/shared-components/store/selector/employee-Profile-Details.selector';
import { EmployeeProfileDetails } from 'src/app/models/hris/employee-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class StoreAccessService {
  public constructor(
    private store: Store<AppState>,
  )
  {}

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
    let employeeProfilesDetails EmployeeProfileDetails[] = [];
    this.store.select(selectEmployeeProfileDetails).subscribe((store) => {
      employeeProfilesDetails = store || '';
    });
    return employeeProfilesDetails;
 
}