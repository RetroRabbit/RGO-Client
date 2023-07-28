import { createAction, props } from '@ngrx/store';
import { UserProfile } from 'src/app/models/userprofile.interface';


export const GetUserProfile = createAction('[userprofile] get user', props<{email:string, token: string }>());
export const GetUserProfileSuccess = createAction('[userprofile] get user', props<{user: UserProfile}>());
