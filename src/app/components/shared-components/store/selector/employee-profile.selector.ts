import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { EmployeeProfilesState } from "../reducers/employee-profile.reducer";

export const selectEmployeeProfilesState = (state: AppState) => state.employeeProfiles;

export const selectEmployeeProfiles = createSelector(
    selectEmployeeProfilesState,
    (state: EmployeeProfilesState) => state.employeeProfiles
);

export const selectLoading = createSelector(
    selectEmployeeProfilesState,
    (state: EmployeeProfilesState) => state.loading
);

export const selectError = createSelector(
    selectEmployeeProfilesState,
    (state: EmployeeProfilesState) => state.error
);