import { EmployeeProfileDetailsState } from 'src/app/components/shared-components/store/reducers/employee-Profile-Details.reducer';
import { ClientState } from "./reducers/client.reducer";
import { TokenState } from "./reducers/sign-in.reducer";

export interface AppState {
  employeeProfileDetails: EmployeeProfileDetailsState;
  token: TokenState
  clients: ClientState
}
