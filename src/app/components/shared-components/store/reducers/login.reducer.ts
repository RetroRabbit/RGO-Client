import { createReducer, on } from '@ngrx/store';
import { Token } from "../../../../models/hris/token.interface";
import { GetLogin } from '../actions/login-in.actions';

export const initialState: Token = {
  email: null,
  token: null,
  roles: null,
};

export const LoginReducer = createReducer(
  initialState,
  on(GetLogin,(state, {payload}) => ({...state, email: payload.email, token: payload.token, type: payload.roles , loading: true})),
);
