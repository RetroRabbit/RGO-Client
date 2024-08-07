import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';;
import * as EmployeeProfileDetailsActions from '../actions/employee-profile-details.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { NewEmployeeProfileService } from 'src/app/services/hris/employee/newEmployeeprofile.service';

@Injectable()
export class EmployeeProfileDetailsEffects {
  constructor(
    private actions$: Actions,
    private newEmployeeProfileService : NewEmployeeProfileService,
  ) {}

  loadEmployeeProfileDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeProfileDetailsActions.loadEmployeeProfileDetails),
      mergeMap((action) => {
        return this.newEmployeeProfileService.getEmployeeProfileDetailsById(action.employeeId).pipe(
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
