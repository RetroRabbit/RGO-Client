import { createAction, props } from '@ngrx/store';
import { Token } from "../../models/token.interface";
import { Events } from 'src/app/models/events.interface';

export const GetLogin = createAction('[signin] UserLogin', props<{ payload: Token }>());
export const GetEvents = createAction('[gradtodo] Get Events', props<{ token: string }>());
export const GetEventsSuccess = createAction('[gradtodo] Get Events Success', props<{ events: Events[] }>());
