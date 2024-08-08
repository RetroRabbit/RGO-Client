import { createAction, props } from '@ngrx/store';
import { EmployeeProfileDetails } from 'src/app/models/hris/EmployeeProfile/employeeProfileDetails.interface';

export const LoadEmployeeProfileDetails = createAction('[EmployeeProfileDetails] Load Employee Profile Details');
export const LoadEmployeeProfileDetailsSuccess = createAction('[EmployeeProfileDetails] Load Employee Profile Details Success', props<{ payload: EmployeeProfileDetails[] }>());
export const LoadEmployeeProfileDetailsFailure = createAction('[EmployeeProfileDetails] Load Employee Profile Details Failure', props<{ error: any }>());

export const SetEmployeeProfileDetails = createAction('[EmployeeProfileDetails] Set Employee Profile Details', props<{ payload: EmployeeProfileDetails[] }>());