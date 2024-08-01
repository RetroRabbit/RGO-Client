import { createAction, props } from '@ngrx/store';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';

export const LoadEmployeeProfiles = createAction('[EmployeeProfile] Load Employee Profile');
export const LoadEmployeeProfilesSuccess = createAction('[EmployeeProfile] Load Employee Profile Success', props<{ payload: string }>());
export const LoadEmployeeProfilesFailure = createAction('[EmployeeProfile] Load Employee Profile Failure', props<{ error: any }>());

export const SetEmployeeProfiles = createAction('[EmployeeProfile] Set Employee Profile', props<{ payload: EmployeeProfile }>());