import { createReducer, on } from '@ngrx/store';
import { Workshop } from '../../models/Workshop.interface';
import * as WorkshopActions from '../actions/workshop.actions';

export interface WorkshopState {
  selectedWorkshop: Workshop;
  TodaysWorkshops: Workshop[];
  AllWorkshops: Workshop[];
}

export const initialState: WorkshopState = {
  selectedWorkshop: {
    id: 0,
    eventId: {
      id: -1,
      groupid: -1,
      title: "",
      description: "",
      userType: -1,
      startDate: new Date,
      endDate: new Date,
      eventType: -1
    },
    presenter: "",
    viewable: true
  },
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
      const dateString = eventId.startDate;
      const targetDate = new Date(dateString);
      const currentDate = new Date();
      const isSameDate =
        targetDate.getFullYear() === currentDate.getFullYear() &&
        targetDate.getMonth() === currentDate.getMonth() &&
        targetDate.getDate() === currentDate.getDate();
      return isSameDate;
    }),
  })),
  on(WorkshopActions.getSelectedWorkshop, (state, { index, workshops }) => ({
    ...state,
    selectedWorkshop: workshops[index]
  })),
);

function getCurrentDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; 
}
