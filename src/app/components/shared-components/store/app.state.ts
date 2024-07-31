import { EmployeeProfileNew } from "src/app/models/hris/EmployeeProfile/employeeProfileNew.interface";

export interface AppState {
  employeeProfiles: EmployeeProfileNew[];
  loading: boolean;
  error: any;
}

export const initialEmployeeProfileState: AppState = {
  employeeProfiles: [],
  loading: false,
  error: null,
};
