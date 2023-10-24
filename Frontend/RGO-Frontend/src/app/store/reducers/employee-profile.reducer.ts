import { createReducer, on } from '@ngrx/store';
import { GetEmployeeProfile, GetEmployeeProfileSuccess, } from '../actions/employee-profile.actions';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';

export interface EmployeeProfileState {
  employeeProfile: EmployeeProfile
}

export const initialState: EmployeeProfileState = {
  employeeProfile: {
    id: 0,
      employeeNumber: '',
      taxNumber: '',
      engagementDate: new Date,
      terminationDate: new Date,
      reportingLine: 0,
      highestQualification: '',
      disability: true,
      disabilityNotes: '',
      countryOfBirth: '',
      nationality: '',
      level: 0,
      employeeType: {
        id: 0,
        name: '',
      },
      title: '',
      name: '',
      initials: '',
      surname: '',
      dateOfBirth: new Date,
      idNumber: '',
      passportNumber: '',
      passportExpirationDate: new Date,
      passportCountryIssue: '',
      race: 1,
      gender: 0,
      knownAs: '',
      pronouns: '',
      email: '',
      personalEmail: '',
      cellphoneNo: '',
      tshirtSize: 0,
      dietaryRestrictions: ''
  }
};

export const EmployeeProfileReducer = createReducer(
  initialState,
  on(GetEmployeeProfile, (state) => ({ ...state, loading: true, })),
  on(GetEmployeeProfileSuccess, (state, { employeeProfile }) => ({ ...state, employeeProfile, loading: true })),
);
