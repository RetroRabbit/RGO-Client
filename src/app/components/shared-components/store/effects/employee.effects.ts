import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EmployeeService } from "src/app/services/hris/employee/employee.service";
import { getAllEmployees, getAllEmployeesSuccess } from "../actions/employee.actions";
import { map, exhaustMap } from "rxjs/operators";

@Injectable()
export class EmployeeEffects{
    constructor(private actions$ : Actions, private employeeService : EmployeeService){}
    
    getEmployees$ = createEffect( () =>
        this.actions$.pipe(
            ofType(getAllEmployees),
            exhaustMap(()=>
                this.employeeService.getAll().pipe(
                    map(employees => getAllEmployeesSuccess({AllEmployees : employees}))
                )
            )
        )
    );
}