import { createReducer, on } from '@ngrx/store';
import { Token } from "../../models/token.interface";
import { GetLogin } from '../actions/app.actions';

export const initialState: Token = {
  email: null,
  token: null,
  type: null,
};

export const loginReducer = createReducer(
  initialState,
  on(GetLogin,(state, {payload}) => ({...state, email: payload.email, token: payload.token, type: payload.type , loading: true})),
);
