import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[sign-in] UserLogin',
  props<{ payload: any }>()
);
