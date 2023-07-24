import { createReducer, on } from '@ngrx/store';
import { GetEvents, GetEventsSuccess } from '../actions/app.actions';
import { Events } from "../../models/events.interface";

export interface EventState{
    events: Events[]
}

export const initialState: EventState = {
  events: [],
};

export const EventReducer = createReducer(
    initialState,
    on(GetEvents,state => ({...state, loading: true})),
    on(GetEventsSuccess,(state, {events}) => ({...state, events,loading: true})),
  );