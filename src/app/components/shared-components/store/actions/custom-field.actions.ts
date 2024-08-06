import { createAction, props } from '@ngrx/store';
import { CustomField } from 'src/app/models/hris/custom-field.interface';

export const LoadCustomField = createAction('[CustomField] Load CustomField');
export const LoadCustomFieldSuccess = createAction('[CustomField] Load CustomField Success', props<{ payload: CustomField[] }>());
export const LoadCustomFieldFailure = createAction('[CustomField] Load CustomField Failure', props<{ error: any }>());

export const SetCustomField = createAction('[CustomField] Set CustomField', props<{ payload: CustomField[] }>());