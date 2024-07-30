import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const selectLoginState = (state: AppState) => state.token;

export const selectToken = createSelector (
    selectLoginState,
    (state)=> state?.token
)

export const selectEmail = createSelector (
    selectLoginState,
    (state)=> state?.email
)

export const selectRole = createSelector (
    selectLoginState,
    (state)=> state?.roles
)