import { createReducer, on } from '@ngrx/store';
import { GetUserProfile, GetUserProfileSuccess,} from '../actions/userprofile.actions';
import { UserProfile } from 'src/app/models/userprofile.interface';

export interface UserProfileState{
  userProfile : UserProfile
}

export const initialState: UserProfileState = {
  userProfile : {
    id : 0,
    groupdid : 0,
    firstName: '',
    lastName:'',
    email: '',
    type: -1,
    joinDate : new Date,
    status: 1,
    skills : [],
    certifications : [],
    project : [],
    socials : {
      id: 0,
      userid:0,
      discord : '',
      codeWars : '',
      gitHub : '',
      linkedIn : ''
    }
  }
};

export const UserProfileReducer = createReducer(
  initialState,
  on(GetUserProfile, (state) => ({...state,loading: true,})),
  on(GetUserProfileSuccess, (state, { userProfile }) => ({...state,userProfile,loading: true}))
);
