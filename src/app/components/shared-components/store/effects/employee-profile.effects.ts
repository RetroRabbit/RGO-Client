import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, catchError, map } from 'rxjs/operators';
import { EmployeeProfileService } from "src/app/services/hris/employee/employee-profile.service";
import * as EmployeeProfileActions from '../actions/employee-profile.actions';
import { of } from 'rxjs';

@Injectable()
export class EmployeeProfileEffects {
  constructor(
    private actions$: Actions,
    private employeeProfileService: EmployeeProfileService
  ) {}

  loadEmployeeProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeProfileActions.LoadClients),
      exhaustMap(() =>
        this.employeeProfileService.getEmployeeProfiles().pipe(
          map(clients => EmployeeProfileActions.LoadEmployeeProfilesSuccess({ payload: clients })),
          catchError(error => of(EmployeeProfileActions.LoadEmployeeProfilesFailure({ error })))
        )
      )
    )
  );
}