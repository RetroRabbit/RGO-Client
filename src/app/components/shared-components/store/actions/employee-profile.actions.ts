import { createAction, props } from '@ngrx/store';
import { EmployeeProfileNew } from 'src/app/models/hris/EmployeeProfile/employeeProfileNew.interface';

export const loadEmployeeProfiles = createAction('[Employee Profile] Load Employee Profiles');

export const loadEmployeeProfilesSuccess = createAction(
  '[Employee Profile] Load Employee Profiles Success',
  props<{ employeeProfiles: EmployeeProfileNew[] }>()
);

export const loadEmployeeProfilesFailure = createAction(
  '[Employee Profile] Load Employee Profiles Failure',
  props<{ error: any }>()
);
