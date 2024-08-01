// selectors/employee-profile.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/employee-profile.reducer';

export const selectEmployeeProfileState = createFeatureSelector<State>('employeeProfile');

export const selectEmployeeProfile = createSelector(
  selectEmployeeProfileState,
  (state) => state.employeeProfile
);
