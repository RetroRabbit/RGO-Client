import { EmployeeProfileNew } from "src/app/models/hris/EmployeeProfile/employeeProfileNew.interface";
import { Token } from "src/app/models/hris/token.interface";
import { State as EmployeeProfileState } from 'src/app/components/shared-components/store/reducers/employee-profile.reducer';

export interface AppState {
  employeeProfile: EmployeeProfileState;
  loading: boolean;
  error: any;
  token: Token;
}
