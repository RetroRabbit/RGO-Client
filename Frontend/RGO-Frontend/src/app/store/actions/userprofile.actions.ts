import { createAction, props } from '@ngrx/store';


export const GetUserProfile = createAction('[userprofile] get user', props<{ user: any }>());
