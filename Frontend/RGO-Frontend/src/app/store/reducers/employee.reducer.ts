import { createReducer, on } from '@ngrx/store';
import { Employee } from '../../models/employee.interface';
import { getAllEmployees, getAllEmployeesSuccess, getSelectedEmployee } from '../actions/employee.actions';


export interface EmployeeState {
    AllEmployees: Employee[],
    selectedEmployee: Employee
}

export const initialState: EmployeeState = {
    AllEmployees: [],
    selectedEmployee: {
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        joinDate: new Date,
    }
}

export const EmployeeReducer = createReducer(
    initialState,
    on(getAllEmployees, state => ({ ...state, loading: true })),
    on(getAllEmployeesSuccess, (state, { AllEmployees }) => ({ ...state, AllEmployees, loading: true })),
    on(getSelectedEmployee, (state, { index, employees }) => ({
        ...state,
        selectedUser: employees[index]
    })),
)
