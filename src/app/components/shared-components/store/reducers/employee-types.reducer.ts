import { createReducer, on } from '@ngrx/store';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';
import { SetEmployeeTypes, LoadEmployeeTypes, LoadEmployeeTypesSuccess, LoadEmployeeTypesFailure } from '../actions/employee-types.actions';

export interface EmployeeTypesState {
  employeeType: EmployeeType[];
  loading: boolean;
  error: string | null;
}

export const initialState: EmployeeTypesState = {
  employeeType: [],
  loading: false,
  error: null,
};

export const employeeTypesReducer = createReducer(
  initialState,

  on(SetEmployeeTypes, (state, { payload }) => ({
    ...state,
    employeeType: payload,
    loading: false,
    error: null
  })),

  on(LoadEmployeeTypes, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(LoadEmployeeTypesSuccess, (state, { payload }) => ({
    ...state,
    employeeType: payload,
    loading: false
  })),

  on(LoadEmployeeTypesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
