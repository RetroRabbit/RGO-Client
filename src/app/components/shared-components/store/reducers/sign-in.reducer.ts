import { createReducer, on } from '@ngrx/store';
import { Token } from "../../../../models/hris/token.interface";
import { SetLogin } from '../actions/sign-in.actions';

export const initialState: Token = {
  email: "",
  token: "",
  roles: "",
};

export const LoginReducer = createReducer(
  initialState,
  on(SetLogin, (state, { payload }) => ({
    ...state,
    email: payload.email,
    token: payload.token,
    roles: payload.roles,
    loading: false
  })),
);
