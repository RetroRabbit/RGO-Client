import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.interface';
import { getAllUsers, getAllUsersSuccess } from '../actions/admin.actions';


export interface AdminState {
    AllUsers : User[]
}

export const initialState: AdminState = {
    AllUsers : []
}

export const AdminReducer = createReducer(
    initialState,
    on(getAllUsers, state => ({...state, loading: true})),
    on(getAllUsersSuccess, (state, {AllUsers}) => ({...state, AllUsers, loading : true}))
)