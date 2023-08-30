import { createReducer, on } from '@ngrx/store';
import { FieldCode } from '../../models/field-code.interface';
import { FieldCodeOptions } from 'src/app/models/field-code-options.interface';
import * as FieldCodeActions from '../actions/field-code.actions';

export interface FieldCodeState {
    fieldCodes: FieldCode[];
    fieldCodeOptions: FieldCodeOptions[];
}

const initialState: FieldCodeState = {
    fieldCodes: [],
    fieldCodeOptions: []
};

export const fieldCodeReducer = createReducer(
    initialState,
    on(FieldCodeActions.addFieldCode, (state, { fieldCode }) => {
        return {
            ...state,
            fieldCodes: [...state.fieldCodes, fieldCode],
        };
    }),
    on(FieldCodeActions.addFieldCodeOptions, (state, { option }) => {
        return {
            ...state,
            fieldCodeOptions: [...state.fieldCodeOptions, option]
        };
    })
);
