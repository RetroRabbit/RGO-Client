// reducers/employee-profile.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { EmployeeProfileNew } from 'src/app/models/hris/EmployeeProfile/employeeProfileNew.interface';
import * as EmployeeProfileActions from '../actions/employee-profile.actions';


export interface State {
  employeeProfiles: EmployeeProfileNew;
  loading: boolean;
  error: any;
}

export const initialState: State = {
  employeeProfiles: {
    employeeProfileDetails: undefined,
    employeeProfilePersonal: undefined,
    employeeProfileContact: undefined,
    employeeProfileSalary: undefined,
    employeeData: undefined,
    employeeQualification: undefined,
    workExperience: [],
    employeeCertifications: [],
    employeeBanking: [],
    authUserId: null,
    employeeNumber: '',
    terminationDate: null,
    notes: '',
    passportNumber: '',
    passportExpirationDate: null,
    passportCountryIssue: '',
    photo: '',
    active: false,
    inactiveReason: null,
    physicalAddress: undefined
  },
  loading: false,
  error: null,
};

export const employeeProfileReducer = createReducer(
  initialState,
  on(EmployeeProfileActions.loadEmployeeProfile, (state) => ({
    ...state,
    loading: true,
  })),
  on(EmployeeProfileActions.loadEmployeeProfileSuccess, (state, { employeeProfile }) => ({
    ...state,
    loading: false,
    employeeProfile: employeeProfile,
  })),
);
