import { createAction, props } from '@ngrx/store';
import { Token } from "../../../../models/hris/token.interface";

export const LoadToken = createAction('[Token] Load Token');
export const LoadTokenSuccess = createAction('[Token] Load Token Success', props<{ payload: string }>());
export const LoadTokenFailure = createAction('[Token] Load Token Failure', props<{ error: any }>());

export const SetToken = createAction('[Token] Set Token', props<{ payload: Token }>());