import { ClientState } from "./reducers/client.reducer";
import { CustomFieldState } from "./reducers/custom-field.reducer";
import { EmployeeTypesState } from "./reducers/employee-types.reducer";
import { TokenState } from "./reducers/sign-in.reducer";

export interface AppState {
  token: TokenState
  clients: ClientState
  customField: CustomFieldState
}
