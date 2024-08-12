import { createReducer, on } from '@ngrx/store';
import { Token } from "../../../../models/hris/token.interface";
import { SetToken, LoadToken, LoadTokenFailure, LoadTokenSuccess } from '../actions/sign-in.actions';

export interface TokenState {
  token: Token | null;
  loading: boolean;
  error: string | null;
}

export const initialState: TokenState = {
  token: null,
  loading: false,
  error: null,
};

export const loginReducer = createReducer(
  initialState,
  
  on(SetToken, (state, { payload }) => ({
    ...state,
    token: payload,
    loading: true,
    error: null
  })),

  on(LoadToken, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(LoadTokenSuccess, (state, { payload }) => ({
    ...state,
    clients: payload,
    loading: false
  })),
  
  on(LoadTokenFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))

);
