import { createAction, props } from '@ngrx/store';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';

export const LoadEmployeeTypes = createAction('[EmployeeTypes] Load EmployeeTypes');
export const LoadEmployeeTypesSuccess = createAction('[EmployeeTypes] Load EmployeeTypes Success', props<{ payload: EmployeeType[] }>());
export const LoadEmployeeTypesFailure = createAction('[EmployeeTypes] Load EmployeeTypes Failure', props<{ error: any }>());

export const SetEmployeeTypes = createAction('[EmployeeType] Set Clients', props<{ payload: EmployeeType[] }>());