import { Action } from '@ngrx/store';
import { AppState } from './app.state';

// Define the initial state
export const initialState: AppState = {
  GoogleID: null // or any other default value
};

export function reducer(state: AppState = initialState, action: Action): AppState {
  switch (action.type) {
    case '[sign-in] UserLogin':
      return { ...state, GoogleID: (action as any).payload }
    default:
      return state;
  }
}
