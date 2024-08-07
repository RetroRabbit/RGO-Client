import { createAction, props } from '@ngrx/store';
import { EmployeeProfileDetails } from 'src/app/models/hris/EmployeeProfile/employeeProfileDetails.interface';

export const loadEmployeeProfileDetails = createAction(
  '[Employee Profile] Load Employee Profile Details' ,
  props<{ employeeId: number }>()
);

export const loadEmployeeProfileDetailsSuccess = createAction(
  '[Employee Profile] Load Employee Profile Details Success',
  props<{ employeeProfileDetails: EmployeeProfileDetails }>()
);

export const loadEmployeeProfileDetailsFailure = createAction(
  '[Employee Profile] Load Employee Profile Details Failure',
  props<{ error: any }>()
);
