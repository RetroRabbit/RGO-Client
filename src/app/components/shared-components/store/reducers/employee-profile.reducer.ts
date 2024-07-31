// reducers/employee-profile.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { EmployeeProfileNew } from 'src/app/models/hris/EmployeeProfile/employeeProfileNew.interface';
import * as EmployeeProfileActions from '../actions/employee-profile.actions';

export interface State {
  employeeProfiles: EmployeeProfileNew[];
  loading: boolean;
  error: any;
}

export const initialState: State = {
  employeeProfiles: [],
  loading: false,
  error: null,
};

export const employeeProfileReducer = createReducer(
  initialState,
  on(EmployeeProfileActions.loadEmployeeProfiles, (state) => ({
    ...state,
    loading: true,
  })),
  on(EmployeeProfileActions.loadEmployeeProfilesSuccess, (state, { employeeProfiles }) => ({
    ...state,
    loading: false,
    employeeProfiles,
  })),
  on(EmployeeProfileActions.loadEmployeeProfilesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
