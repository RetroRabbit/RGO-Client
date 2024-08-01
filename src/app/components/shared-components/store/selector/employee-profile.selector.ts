// selectors/employee-profile.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { EmployeeProfileNew } from 'src/app/models/hris/EmployeeProfile/employeeProfileNew.interface';

export const selectEmployeeProfileState = (state: AppState) => state;

export const selectEmployeeProfile = createSelector(
  selectEmployeeProfileState,
  (state) => state.employeeProfile
);


                                                                                                                                                                                                