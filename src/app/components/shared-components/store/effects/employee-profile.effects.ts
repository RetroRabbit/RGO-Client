import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, catchError, map } from 'rxjs/operators';
import { EmployeeProfileService } from "src/app/services/hris/employee/employee-profile.service";
import * as EmployeeProfilesActions from '../actions/employee-profile.actions';
import { of } from 'rxjs';

@Injectable()
export class EmployeeProfilesEffects {
  constructor(
    private actions$: Actions,
    private employeeProfileService: EmployeeProfileService
  ) {}

  loadEmployeeProfiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeProfilesActions.LoadEmployeeProfiles),
      exhaustMap(() =>
        this.employeeProfileService.getEmployeeProfiles().pipe(
          map(employeeProfiles => EmployeeProfilesActions.LoadEmployeeProfilesSuccess({ payload: employeeProfiles })),
          catchError(error => of(EmployeeProfilesActions.LoadEmployeeProfilesFailure({ error })))
        )
      )
    )
  );
}