import { createAction, props } from '@ngrx/store';
import { EmployeeProfileNew } from 'src/app/models/hris/EmployeeProfile/employeeProfileNew.interface';

export const loadEmployeeProfile = createAction(
  '[Employee Profile] Load Employee Profile',
  props<{ employeeId: number }>()
);

export const loadEmployeeProfileSuccess = createAction(
  '[Employee Profile] Load Employee Profile Success',
  props<{ employeeProfile: EmployeeProfileNew }>()
);

export const loadEmployeeProfileFailure = createAction(
  '[Employee Profile] Load Employee Profile Failure',
  props<{ error: any }>()
);
