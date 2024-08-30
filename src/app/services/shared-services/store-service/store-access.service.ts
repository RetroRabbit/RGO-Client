import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/components/shared-components/store/app.state';
import { selectEmployeeProfileDetails } from 'src/app/components/shared-components/store/selector/employee-profile-details.selector';
import { EmployeeProfileDetails } from 'src/app/models/hris/EmployeeProfile/employeeProfileDetails.interface';

@Injectable({
  providedIn: 'root',
})
export class StoreAccessService {
  public constructor(
    private store: Store<AppState>,
  ) { }

  getEmployeeProfileDetails(): EmployeeProfileDetails[] {
    let employeeProfileDetails: EmployeeProfileDetails[] = [];
    this.store.select(selectEmployeeProfileDetails).subscribe((store) => {
      employeeProfileDetails = store || '';
    });
    return employeeProfileDetails;
  }

}