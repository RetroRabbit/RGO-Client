import { createReducer, on } from '@ngrx/store';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import * as customFieldActions  from '../actions/custom-field.actions';

export interface CustomFieldState {
  customField: CustomField[];
  loading: boolean;
  error: string | null;
}

export const initialState: CustomFieldState = {
  customField: [],
  loading: false,
  error: null,
};

export const customFieldReducer = createReducer(
  initialState,

  on(customFieldActions.SetCustomField, (state, { payload }) => ({
    ...state,
    customField: payload,
    loading: false,
    error: null
  })),

  on(customFieldActions.LoadCustomField, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(customFieldActions.LoadCustomFieldSuccess, (state, { payload }) => ({
    ...state,
    customField: payload,
    loading: false
  })),

  on(customFieldActions.LoadCustomFieldFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
