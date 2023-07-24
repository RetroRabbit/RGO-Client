import { createReducer, on } from '@ngrx/store';
import { Token } from "../../models/token.interface";
import { GetLogin } from '../actions/app.actions';

// Define the initial state
export const initialState: Token = {
  email: null,
  token: null
};

export const loginReducer = createReducer(
  initialState,
  on(GetLogin,(state, {payload}) => ({...state, email: payload.email, token: payload.token , loading: true})),
);

