import { createAction, props } from '@ngrx/store';
import { FieldCode } from 'src/app/models/field-code.interface';
import { FieldCodeOptions } from 'src/app/models/field-code-options.interface';

// Action types
export const addFieldCode = createAction(
  '[Field Code] Add',
  props<{ fieldCode: FieldCode }>()
);
// TODO: deleteFieldCode, updateFieldCode, etc.
export const addFieldCodeOption = createAction(
  '[Field Code] Add FieldCodeOptions',
  props<{ option: FieldCodeOptions }>()
);
