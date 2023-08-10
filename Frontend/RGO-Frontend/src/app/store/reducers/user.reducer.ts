import { User } from "src/app/models/user.interface";
import { createUser } from "../actions/user.action";
import { createReducer, on } from '@ngrx/store';


export interface UserState{
    user : User | null
  }

  export const initialState: UserState = {
    user : null
  };

  export const UserReducer = createReducer(
    initialState,
    on(createUser, (state) => ({...state,loading: true,}))
  );


  