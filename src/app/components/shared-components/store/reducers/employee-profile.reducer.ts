// reducers/employee-profile.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { EmployeeProfileNew } from 'src/app/models/hris/EmployeeProfile/employeeProfileNew.interface';
import * as EmployeeProfileActions from '../actions/employee-profile.actions';

export interface State {
  employeeProfile: EmployeeProfileNew | null;
  loading: boolean;
  error: any;
}

export const initialState: State = {
  employeeProfile: null,
  loading: false,
  error: null,
};

export const employeeProfileReducer = createReducer(
  initialState,
  on(EmployeeProfileActions.loadEmployeeProfile, (state) => ({
    ...state,
    loading: true,
  })),
  on(EmployeeProfileActions.loadEmployeeProfileSuccess, (state, { employeeProfile }) => ({
    ...state,
    loading: false,
    employeeProfile,
  })),
);
