import { createAction, props } from '@ngrx/store';
import { Workshop } from '../../models/Workshop.interface';

export const getSelectedWorkshop = createAction(
  '[Workshops] Set Selected Workshop',
  props<{ workshops: Workshop }>()
);

export const getAllWorkshops = createAction(
  '[Workshops] Get All Workshops',
  props<{ token: string }>()
);

export const getTodaysWorkshop = createAction(
    '[Workshops] Get Todays Workshops' 
);

export const getAllWorkshopSuccess = createAction(
    '[Workshops] Get All Workshops',
    props<{ AllWorkshops: Workshop[] }>()
)