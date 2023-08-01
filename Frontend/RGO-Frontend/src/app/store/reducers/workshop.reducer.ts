import { createReducer, on } from '@ngrx/store';
import { Workshop } from '../../models/Workshop.interface';
import * as WorkshopActions from '../actions/workshop.actions';

export interface WorkshopState {
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
  on(WorkshopActions.getAllWorkshops, state => ({ ...state, loading: true })),
  on(WorkshopActions.getAllWorkshopSuccess, (state, { AllWorkshops }) => ({ ...state, AllWorkshops, loading: true })),
  on(WorkshopActions.getTodaysWorkshop, (state) => ({
    ...state,
    TodaysWorkshops: state.AllWorkshops.filter((workshop) => {
      const eventId = workshop.eventId;
  
      // Step 1: Parse the string into a Date object
      const dateString = eventId.startDate;
      const targetDate = new Date(dateString);
  
      // Step 2: Get the current date
      const currentDate = new Date();
  
      // Step 3: Compare the two dates (by comparing their year, month, and day)
      const isSameDate =
        targetDate.getFullYear() === currentDate.getFullYear() &&
        targetDate.getMonth() === currentDate.getMonth() &&
        targetDate.getDate() === currentDate.getDate();
  
      // Step 4: Return true if the workshop's date is the same as the current date
      return isSameDate;
    }),
  }))
  
);

function getCurrentDate(): string {
  // Implement a function to get the current date in a specific format
  const today = new Date();
  return today.toISOString().split('T')[0]; // Assuming we only need the date part in 'YYYY-MM-DD' format
}
