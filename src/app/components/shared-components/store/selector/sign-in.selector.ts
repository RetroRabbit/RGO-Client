import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { TokenState } from "../reducers/sign-in.reducer";

export const selectTokenState = (state: AppState) => state.token;

export const selectToken = createSelector (
    selectTokenState,
    (state: TokenState) => state.token
)

export const selectLoading = createSelector (
    selectTokenState,
    (state: TokenState) => state.loading
)

export const selectError = createSelector (
    selectTokenState,
    (state: TokenState) => state.error
)