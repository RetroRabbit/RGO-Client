import { createReducer, on } from '@ngrx/store';
import { GetEmployeeProfile, GetEmployeeProfileSuccess, } from '../actions/employee-profile.actions';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';

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
      peopleChampion: 0,
      disability: true,
      disabilityNotes: '',
      countryOfBirth: '',
      nationality: '',
      level: 0,
      employeeType: {
        id: 0,
        name: '',
      },
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
      email: '',
      personalEmail: '',
      cellphoneNo: '',
      photo: '',
      notes: '',
      leaveInterval: 0,
      salaryDays: 0,
      payRate: 0,
      salary: 0,
      clientAllocated: '',
      teamLead: 0
  }
};

export const EmployeeProfileReducer = createReducer(
  initialState,
  on(GetEmployeeProfile, (state) => ({ ...state, loading: true, })),
  on(GetEmployeeProfileSuccess, (state, { employeeProfile }) => ({ ...state, employeeProfile, loading: true })),
);
