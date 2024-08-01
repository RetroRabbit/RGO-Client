import { EmployeeProfileNew } from "src/app/models/hris/EmployeeProfile/employeeProfileNew.interface";
import { Token } from "src/app/models/hris/token.interface";

export interface AppState {
  employeeProfile: EmployeeProfileNew;
  loading: boolean;
  error: any;
  token: Token
}