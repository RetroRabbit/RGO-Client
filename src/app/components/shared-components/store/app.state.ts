import { State as EmployeeProfileState } from 'src/app/components/shared-components/store/reducers/employee-profile.reducer';
import { State as EmployeeProfileDetailsState } from 'src/app/components/shared-components/store/reducers/employee-Profile-Details.reducer';
import { ClientState } from "./reducers/client.reducer";
import { TokenState } from "./reducers/sign-in.reducer";

export interface AppState {
  employeeProfile: EmployeeProfileState;
  employeeProfileDetails: EmployeeProfileDetailsState;
  loading: boolean;
  error: any;
  token: TokenState
  clients: ClientState
}
