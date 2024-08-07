import { createReducer, on } from '@ngrx/store';
import * as EmployeeProfileDetailsActions from '../actions/employee-Profile-Details.actions';
import { EmployeeProfileDetails } from 'src/app/models/hris/EmployeeProfile/employeeProfileDetails.interface';

export interface EmployeeProfileDetailsState {
  employeeProfileDetails: EmployeeProfileDetails | null;
  loading: boolean;
  error: any;
}

export const initialState: EmployeeProfileDetailsState = {
  employeeProfileDetails: null,
  loading: false,
  error: null,
};

export const employeeProfileDetailsReducer = createReducer(
  initialState,
  on(EmployeeProfileDetailsActions.loadEmployeeProfileDetails, (state) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(EmployeeProfileDetailsActions.loadEmployeeProfileDetailsSuccess, (state, { employeeProfileDetails }) => {
    return {
      ...state,
      loading: false,
      employeeProfileDetails,
    };
  }),
  on(EmployeeProfileDetailsActions.loadEmployeeProfileDetailsFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error,
    };
  })
);
