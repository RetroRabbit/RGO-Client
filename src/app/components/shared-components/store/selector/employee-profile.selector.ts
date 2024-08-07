import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { EmployeeProfileDetailsState  } from "../reducers/employee-profile-details.reducer";

export const selectEmployeeProfileDetailsState = (state: AppState) => state.employeeProfileDetails;

export const selectEmployeeProfileDetails = createSelector(
    selectEmployeeProfileDetailsState,
    (state: EmployeeProfileDetailsState) => state.employeeProfileDetails
);

export const selectLoading = createSelector(
    selectEmployeeProfileDetailsState,
    (state: EmployeeProfileDetailsState) => state.loading
);

export const selectError = createSelector(
    selectEmployeeProfileDetailsState,
    (state: EmployeeProfileDetailsState) => state.error
);