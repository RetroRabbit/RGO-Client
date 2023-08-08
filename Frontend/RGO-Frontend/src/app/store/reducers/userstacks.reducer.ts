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
    initialState, on(UserstacksActions.GetUserstacks, (state) => ({...state, loading: true})),
    on(UserstacksActions.GetUserstacksSuccess, (state, {userstacks}) => ({...state, userstacks, loading: true}))
);