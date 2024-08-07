import { createReducer, on } from '@ngrx/store';
import * as EmployeeProfileDetailsActions from '../actions/employee-profile-details.actions';
import { EmployeeProfileDetails } from 'src/app/models/hris/EmployeeProfile/employeeProfileDetails.interface';

export interface EmployeeProfileDetailsState {
  employeeProfileDetails: EmployeeProfileDetails[];
  loading: boolean;
  error: string | null;
}

export const initialState: EmployeeProfileDetailsState = {
  employeeProfileDetails: [],
  loading: false,
  error: null,
};

export const employeeProfileDetailsReducer = createReducer(
  initialState,

  on(EmployeeProfileDetailsActions.SetEmployeeProfileDetails, (state, { payload }) => ({
    ...state,
    customField: payload,
    loading: false,
    error: null
  })),

  on(EmployeeProfileDetailsActions.LoadEmployeeProfileDetails, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(EmployeeProfileDetailsActions.LoadEmployeeProfileDetailsSuccess, (state, { payload }) => ({
    ...state,
    customField: payload,
    loading: false
  })),

  on(EmployeeProfileDetailsActions.LoadEmployeeProfileDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
