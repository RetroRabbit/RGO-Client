import { createReducer, on } from '@ngrx/store';
import * as EmployeeProfilesActions from '../actions//employee-profile.actions';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';

export interface EmployeeProfilesState {
  employeeProfiles: EmployeeProfile[];
  loading: boolean;
  error: string | null;
}

export const initialState: EmployeeProfilesState = {
  employeeProfiles: [],
  loading: false,
  error: null,
};

export const employeeProfilesReducer = createReducer(
  initialState,

  on(EmployeeProfilesActions.SetEmployeeProfiles, (state, { payload }) => ({
    ...state,
    customField: payload,
    loading: false,
    error: null
  })),

  on(EmployeeProfilesActions.LoadEmployeeProfiles, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(EmployeeProfilesActions.LoadEmployeeProfilesSuccess, (state, { payload }) => ({
    ...state,
    customField: payload,
    loading: false
  })),

  on(EmployeeProfilesActions.LoadEmployeeProfilesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
