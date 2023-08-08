
import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/userprofile.interface';

export const GetUserProfile = createAction('[User] get user' );
export const GetUserProfileSuccess = createAction('[User] get user',props<{userProfile: User}>());