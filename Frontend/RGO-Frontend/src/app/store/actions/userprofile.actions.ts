import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/userprofile.interface';


export const GetUserProfile = createAction('[user] get user', props<{email:string, token: string }>());
export const GetUserProfileSuccess = createAction('[user] get user', props<{userProfile: User}>());