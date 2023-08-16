import { createReducer, on} from "@ngrx/store";
import { Userstacks } from "src/app/models/userstacks.interface";
import * as UserstacksActions from "../actions/userstacks.action"

export interface UserstackState{
    userstacks: Userstacks | null
}

export const initialState: UserstackState = {
  userstacks: null
};

export const UserstackReducer = createReducer(
    initialState, on(UserstacksActions.GetUserstacks, (state) => ({...state})),
    on(UserstacksActions.GetUserstacksSuccess, (state, {userstacks}) => ({...state, userstacks})),
    on(UserstacksActions.SetUserstack, (state) => ({... state})),
    on(UserstacksActions.SetUserstackSuccess, (state, {userstacks}) => ({...state, userstacks})),
    on(UserstacksActions.UpdateUserstack, (state, {userstacks}) => ({... state, userstacks})),
    on(UserstacksActions.UpdateUserstackSuccess, (state, {userstacks}) => ({...state, userstacks})),
);