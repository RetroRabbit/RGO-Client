import { Action, createReducer, on } from '@ngrx/store';
import { AppState } from './app.state';
import { Users } from "../models/user.interface";
import { GetLogin } from './app.actions';

// Define the initial state
export const initialState: Users = {
  GoogleId: null,
};

export const loginReducer = createReducer(
  initialState,
  on(GetLogin,(state, {payload}) => ({...state, payload, loading: false}))
);
