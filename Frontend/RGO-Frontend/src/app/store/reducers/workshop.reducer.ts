import { createReducer, on } from '@ngrx/store';
import { Workshop } from '../../models/Workshop.interface';
import * as WorkshopActions from '../actions/workshop.actions';

export interface WorkshopState{
    selectedWorkshop: Workshop | null;
  TodaysWorkshops: Workshop[];
  AllWorkshops: Workshop[];
}

export const initialState: WorkshopState = {
  selectedWorkshop: null,
  TodaysWorkshops: [],
  AllWorkshops: [],
};

export const WorkshopReducer = createReducer(
  initialState,
  // on(WorkshopActions.getSelectedWorkshop, (state , {workshops}) => ({ ...state, 
  //       // filter through the the array to get the selected workshop
  //   })),
  
  
  on(WorkshopActions.getAllWorkshops, state  => ({ ...state , loading: true})),
  on(WorkshopActions.getAllWorkshopSuccess, (state ,{ AllWorkshops }) => ({ ...state, AllWorkshops, loading: true }))



);

function getCurrentDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Assuming we only need the date part in 'YYYY-MM-DD' format
}
