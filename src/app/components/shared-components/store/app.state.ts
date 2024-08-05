import { Token } from "src/app/models/hris/token.interface";
import { State as EmployeeProfileState } from 'src/app/components/shared-components/store/reducers/employee-profile.reducer';
import { State as EmployeeProfileDetailsState } from 'src/app/components/shared-components/store/reducers/employee-Profile-Details.reducer';

export interface AppState {
  employeeProfile: EmployeeProfileState;
  employeeProfileDetails: EmployeeProfileDetailsState;
  loading: boolean;
  error: any;
  token: Token;
}
