import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/components/shared-components/store/app.state';
import { selectClients } from 'src/app/components/shared-components/store/selector/client.selector';
import { selectEmployeeProfiles } from 'src/app/components/shared-components/store/selector/employee-profile.selector';
import { Client } from 'src/app/models/hris/client.interface';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';

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

  getEmployeeProfiles(): EmployeeProfile[] {
    let employeeProfiles: EmployeeProfile[] = [];
    this.store.select(selectEmployeeProfiles).subscribe((store) => {
      employeeProfiles = store || '';
    });
    return employeeProfiles;
  }
 
}