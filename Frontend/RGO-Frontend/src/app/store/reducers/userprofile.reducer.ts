import { createReducer, on } from '@ngrx/store';
import {
  GetUserProfile,
  GetUserProfileSuccess,
} from '../actions/userprofile.actions';
import { UserProfile } from 'src/app/models/userprofile.interface';
export interface UserProfileState{user:UserProfile | null}
export const initialState: UserProfileState = {
  // firstName: null,
  // lastName:null,
  // email: null,
  // phoneNumber: null,
  // level: null,
  // bio: null,
  // // discord: null,
  // // codeWars: null,
  // // github: null,
  // // linkedin: null,
  // // skills: [],
  // // certifications: [],
  // // projects: [],
  user: null
};

export const UserProfileReducer = createReducer(
  initialState,
  on(GetUserProfile, (state, { email, token }) => ({
    ...state,
    loading: true,
  })),
  on(GetUserProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    // firstName: user.firstName,
    // lastName:user.lastName,
    // email: user.email,
    // phoneNumber: user.phoneNumber,
    // level: user.level,
    // bio: user.bio,
    // discord: user.discord,
    // codeWars: user.codeWars,
    // github: user.github,
    // linkedin: user.linkedin,
    // skills: user.skills,
    // certifications: user.certifications,
    // projects: user.projects,
    loading: true,
  }))
);
