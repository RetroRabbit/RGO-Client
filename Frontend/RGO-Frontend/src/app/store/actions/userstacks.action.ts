import { createAction, props } from "@ngrx/store";
import { Userstacks } from "src/app/models/userstacks.interface";

export const GetUserstacks = createAction('[personalproject] Get Users Stack');
export const GetUserstacksSuccess = createAction('[personalproject] Get Users Stack', props<{userstacks: Userstacks}>());
export const SetUserstack = createAction('[personalproject] Generate User Stack')
export const SetUserstackSuccess = createAction('[personalproject] Generate User Stack', props<{userstacks: Userstacks}>())