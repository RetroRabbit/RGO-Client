import { createAction, props } from '@ngrx/store';
import { Client } from "../../../../models/hris/client.interface";

export const LoadClients = createAction('[Client] Load Clients');
export const LoadClientsSuccess = createAction('[Client] Load Clients Success', props<{ payload: Client[] }>());
export const LoadClientsFailure = createAction('[Client] Load Clients Failure', props<{ error: any }>());

export const SetClients = createAction('[Token] Set Clients', props<{ payload: Client[] }>());