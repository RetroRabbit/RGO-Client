import { createReducer, on } from '@ngrx/store';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SetEmployeeProfiles, LoadEmployeeProfiles, LoadEmployeeProfilesSuccess, LoadEmployeeProfilesFailure } from '../actions/employee-profile.actions';

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

  on(SetEmployeeProfiles, (state, { payload }) => ({
    ...state,
    employeeProfiles: payload,
    loading: false,
    error: null
  })),

  on(LoadEmployeeProfiles, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(LoadEmployeeProfilesSuccess, (state, { payload }) => ({
    ...state,
    clients: payload,
    loading: false
  })),

  on(LoadEmployeeProfilesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);