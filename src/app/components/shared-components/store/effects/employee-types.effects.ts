import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, catchError, map } from 'rxjs/operators';
import { EmployeeTypeService } from "src/app/services/hris/employee/employee-type.service";
import * as EmployeeTypesActions from '../actions/employee-types.actions';
import { of } from 'rxjs';

@Injectable()
export class EmployeeTypesEffects {
  constructor(
    private actions$: Actions,
    private employeeTypeService: EmployeeTypeService
  ) {}

  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeTypesActions.LoadEmployeeTypes),
      exhaustMap(() =>
        this.employeeTypeService.getAllEmployeeTypes().pipe(
          map(clients => EmployeeTypesActions.LoadEmployeeTypesSuccess({ payload: clients })),
          catchError(error => of(EmployeeTypesActions.LoadEmployeeTypesFailure({ error })))
        )
      )
    )
  );
}
