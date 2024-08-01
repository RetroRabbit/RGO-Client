import { createAction, createSelector, props } from '@ngrx/store';
import { EmployeeProfileNew } from 'src/app/models/hris/EmployeeProfile/employeeProfileNew.interface';
import { selectEmployeeProfileState } from '../selector/employee-profile.selector';

//get 
export const loadEmployeeProfile = createAction(
  '[Employee Profile] Load Employee Profile Details',
  props<{ employeeId: number }>()
);

//put
export const loadEmployeeProfileSuccess = createAction(
  '[Employee Profile] Load Employee Profile Details Success',
  props<{ employeeProfile: EmployeeProfileNew }>()
);

