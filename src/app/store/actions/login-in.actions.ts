import { createAction, props } from '@ngrx/store';
import { Token } from "../../models/token.interface";

export const GetLogin = createAction('[signin] UserLogin', props<{ payload: Token }>());