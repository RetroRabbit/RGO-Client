import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';;
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import * as EmployeeProfileDetailsActions from '../actions/employee-Profile-Details.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class EmployeeProfileDetailsEffects {
  constructor(
    private actions$: Actions,
    private employeeService: EmployeeProfileService
  ) {}

  loadEmployeeProfileDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeProfileDetailsActions.loadEmployeeProfileDetails),
      mergeMap((action) => {
        return this.employeeService.getEmployeeProfileDetailsById(action.employeeId).pipe(
          map((employeeProfileDetails) => {
            return EmployeeProfileDetailsActions.loadEmployeeProfileDetailsSuccess({ employeeProfileDetails });
          }),
          catchError(error => {
            return of(EmployeeProfileDetailsActions.loadEmployeeProfileDetailsFailure({ error }));
          })
        );
      })
    )
  );

}
