import { Action, createReducer, on } from '@ngrx/store';
import { Token } from "../models/token.interface";
import { GetLogin } from './app.actions';

// Define the initial state
export const initialState: Token = {
  GoogleId: null,
};

export const loginReducer = createReducer(
  initialState,
  on(GetLogin,(state, {payload}) => ({...state, GoogleId: payload.GoogleId , loading: true})),
);
