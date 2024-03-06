import { createAction, props } from '@ngrx/store';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';

export const GetEmployeeProfile = createAction('[Employee] get employee');
export const GetEmployeeProfileSuccess = createAction('[Employee] get employee', props<{ employeeProfile: EmployeeProfile }>());

export const UpdateEmployeeProfile = createAction('[Employee] update employee', props<{ updatedProfile: EmployeeProfile }>());
export const UpdateEmployeeProfileSuccess = createAction('[Employee] update employee', props<{ response: any }>());