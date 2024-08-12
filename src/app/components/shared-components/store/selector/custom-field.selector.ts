import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { CustomFieldState } from "../reducers/custom-field.reducer";

export const selectCustomFieldState = (state: AppState) => state.customField;

export const selectCustomField = createSelector(
    selectCustomFieldState,
    (state: CustomFieldState) => state.customField
);

export const selectLoading= createSelector(
    selectCustomFieldState,
    (state: CustomFieldState) => state.loading
);

export const selectError = createSelector(
    selectCustomFieldState,
    (state: CustomFieldState) => state.error
);