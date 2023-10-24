import { createAction, props } from "@ngrx/store";
import { Employee } from "src/app/models/employee.interface";

export const getAllEmployees = createAction(
    '[User] Get All Employees'
)

export const getAllEmployeesSuccess = createAction(
    '[AllEmployees] Get All Employees',
    props<{AllEmployees : Employee[]}>()
)

export const getSelectedEmployee = createAction(
    '[Workshops] Set Selected User',
    props<{ index: number, employees : Employee[] }>()
  );