import { ClientState } from "./reducers/client.reducer";
import { CustomFieldState } from "./reducers/custom-field.reducer";
import { TokenState } from "./reducers/sign-in.reducer";
import { EmployeeProfileDetailsState } from 'src/app/components/shared-components/store/reducers/employee-profile-details.reducer';

export interface AppState {
  token: TokenState
  clients: ClientState
  customField: CustomFieldState
  employeeProfileDetails: EmployeeProfileDetailsState
}
