import { createReducer, on } from '@ngrx/store';
import { GetUserProfile, GetUserProfileSuccess,} from '../actions/userprofile.actions';
import { UserProfile } from 'src/app/models/userprofile.interface';

export interface UserProfileState{
  userProfile : UserProfile | null
}

export const initialState: UserProfileState = {
  userProfile : null
};

export const UserProfileReducer = createReducer(
  initialState,
  on(GetUserProfile, (state) => ({...state,loading: true,})),
  on(GetUserProfileSuccess, (state, { userProfile }) => ({...state,userProfile,loading: true})),
);
