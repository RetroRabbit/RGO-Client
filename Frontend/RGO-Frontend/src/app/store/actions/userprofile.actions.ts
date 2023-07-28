import { createAction, props } from '@ngrx/store';
import { Token } from "../../models/token.interface";


export const GetUserProfile = createAction('[userprofile] get user', props<{  user: any, token: string }>());
