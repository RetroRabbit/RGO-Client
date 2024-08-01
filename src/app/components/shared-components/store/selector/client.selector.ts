import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { ClientState } from "../reducers/client.reducer";

export const selectClientState = (state: AppState) => state.clients;

export const selectClients = createSelector(
    selectClientState,
    (state: ClientState) => state.clients
);

export const selectLoading = createSelector(
    selectClientState,
    (state: ClientState) => state.loading
);

export const selectError = createSelector(
    selectClientState,
    (state: ClientState) => state.error
);