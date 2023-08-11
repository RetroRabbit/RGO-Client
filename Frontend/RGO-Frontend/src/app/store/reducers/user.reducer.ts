import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.interface';
import { getAllUsers, getAllUsersSuccess, getSelectedUser } from '../actions/user.actions';


export interface UserState {
    AllUsers : User[],
    selectedUser : User
}

export const initialState: UserState = {
    AllUsers : [],
    selectedUser : {
        id: 0,
        gradGroupId : 0,
        firstName: "",
        lastName:"",
        email: "",
        type: -1,
        joinDate : new Date,
        status: 1,
    
    }
}

export const UserReducer = createReducer(
    initialState,
    on(getAllUsers, state => ({...state, loading: true})),
    on(getAllUsersSuccess, (state, {AllUsers}) => ({...state, AllUsers, loading : true})),
    on(getSelectedUser, (state, { index, users }) => ({
        ...state,
        selectedUser: users[index]
    })),
)