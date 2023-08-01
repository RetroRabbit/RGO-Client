import { createReducer, on } from "@ngrx/store";
import { Workshop } from "src/app/models/Workshop.interface";
import { GetAllWorkshops, GetAllWorkshopsSuccess } from "../actions/workshop.actions";

export interface WorkshopState{
    selectedWorkshop : Workshop | undefined,
    TodaysWorkshops : Workshop[],
    AllWorkshops : Workshop[]
}

export const initialState: WorkshopState = {
    selectedWorkshop : undefined,
    TodaysWorkshops : [],
    AllWorkshops : []
}

export const WorkshopReducer = createReducer(
    initialState,
    on(GetAllWorkshops, state => ({...state, loading : true})),
    on(GetAllWorkshopsSuccess,(state, {workshops}) => ({...state, workshops,loading: true})),
)