
import { createAction, props } from '@ngrx/store';
import { UserProfile } from 'src/app/models/userprofile.interface';

export const GetUserProfile = createAction('[User] get user');
export const GetUserProfileSuccess = createAction('[User] get user', props<{ userProfile: UserProfile }>());

export const UpdateUserProfile = createAction('[User] update user', props<{ response: UserProfile }>());
export const UpdateUserProfileSuccess = createAction('[User] update user', props<{ response: any }>());
