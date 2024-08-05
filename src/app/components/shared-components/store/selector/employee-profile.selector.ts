import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/employee-Profile-Details.reducer';

export const selectEmployeeProfiledetailsState = createFeatureSelector<State>('employeeProfileDetails');

export const selectEmployeeProfile = createSelector(
  selectEmployeeProfiledetailsState,
  (state) => state.employeeProfileDetails
);
