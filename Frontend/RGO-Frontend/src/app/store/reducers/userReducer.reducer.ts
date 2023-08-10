import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.interface';
import { getAllUsers, getAllUsersSuccess } from '../actions/userAction.actions';


export interface UserState {
    AllUsers : User[]
}

export const initialState: UserState = {
    AllUsers : []
}

export const UserReducer = createReducer(
    initialState,
    on(getAllUsers, state => ({...state, loading: true})),
    on(getAllUsersSuccess, (state, {AllUsers}) => ({...state, AllUsers, loading : true}))
)