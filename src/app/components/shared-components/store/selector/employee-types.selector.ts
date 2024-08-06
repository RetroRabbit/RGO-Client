import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { EmployeeTypesState } from "../reducers/employee-types.reducer";

export const selectEmployeeTypesState = (state: AppState) => state.employeeType;

export const selectEmployeeTypes = createSelector(
    selectEmployeeTypesState,
    (state: EmployeeTypesState) => state.employeeType
);

export const selectLoading = createSelector(
    selectEmployeeTypesState,
    (state: EmployeeTypesState) => state.loading
);

export const selectError = createSelector(
    selectEmployeeTypesState,
    (state: EmployeeTypesState) => state.error
);