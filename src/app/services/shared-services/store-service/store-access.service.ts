import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/components/shared-components/store/app.state';
import { selectCustomField } from 'src/app/components/shared-components/store/selector/custom-field.selector';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { selectEmployeeProfileDetails } from 'src/app/components/shared-components/store/selector/employee-profile-details.selector';
import { EmployeeProfileDetails } from 'src/app/models/hris/EmployeeProfile/employeeProfileDetails.interface';

@Injectable({
  providedIn: 'root',
})
export class StoreAccessService {
  public constructor(
    private store: Store<AppState>,
  ) { }

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

}