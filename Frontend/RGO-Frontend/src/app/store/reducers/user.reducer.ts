import { User } from "src/app/models/user.interface";
import { createReducer, on } from '@ngrx/store';
import { getAllUsers, getAllUsersSuccess } from '../actions/user.actions';


export interface UserState {
    AllUsers : User[],
}

export const initialState: UserState = {
    AllUsers : []
}

export const UserReducer = createReducer(
    initialState,
    on(getAllUsers, state => ({...state, loading: true})),
    on(getAllUsersSuccess, (state, {AllUsers}) => ({...state, AllUsers, loading : true})),
)
