import { createAction, props } from '@ngrx/store';
import { Token } from "../../../../models/hris/token.interface";

export const SetLogin = createAction('[sign-in] SetLogin', props<{ payload: Token }>());
export const SetLoginSuccess = createAction('[sign-in] SetLogin Success', props<{ payload: string }>());
export const SetLoginFailure = createAction('[sign-in] SetLogin Failure', props<{ error: any }>());
