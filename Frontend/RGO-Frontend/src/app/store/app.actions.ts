import { createAction, props } from '@ngrx/store';
import { Users } from "../models/user.interface";

export const GetLogin = createAction('[signin] UserLogin', props<{ payload: Users }>());
