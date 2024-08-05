import { createReducer, on } from '@ngrx/store';
import { Client } from "../../../../models/hris/client.interface";
import { SetClients, LoadClients, LoadClientsSuccess, LoadClientsFailure } from '../actions/client.actions';

export interface ClientState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

export const initialState: ClientState = {
  clients: [],
  loading: false,
  error: null,
};

export const clientReducer = createReducer(
  initialState,

  on(SetClients, (state, { payload }) => ({
    ...state,
    clients: payload,
    loading: false,
    error: null
  })),

  on(LoadClients, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(LoadClientsSuccess, (state, { payload }) => ({
    ...state,
    clients: payload,
    loading: false
  })),

  on(LoadClientsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
