import { EmployeeProfileDetailsState } from 'src/app/components/shared-components/store/reducers/employee-Profile-Details.reducer';
import { ClientState } from "./reducers/client.reducer";
import { CustomFieldState } from "./reducers/custom-field.reducer";
import { TokenState } from "./reducers/sign-in.reducer";

export interface AppState {
  employeeProfileDetails: EmployeeProfileDetailsState;
  token: TokenState
  clients: ClientState
  customField: CustomFieldState
}
