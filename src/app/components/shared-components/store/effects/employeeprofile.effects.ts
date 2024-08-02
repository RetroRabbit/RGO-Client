// effects/employee-profile.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import * as EmployeeProfileActions from '../actions/employee-profile.actions';

@Injectable()
export class EmployeeProfileEffects {
  constructor(
    private actions$: Actions,
    private employeeService: EmployeeProfileService
  ) {}

  loadEmployeeProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeProfileActions.loadEmployeeProfile),
      mergeMap((action) => {
        return this.employeeService.getNEWEmployeeById(action.employeeId).pipe(
          map((employeeProfile) => {
            return EmployeeProfileActions.loadEmployeeProfileSuccess({ employeeProfile });
          }),
          catchError(error => {
            return of(EmployeeProfileActions.loadEmployeeProfileFailure({ error }));
          })
        );
      })
    )
  );
}


// effect(the logic which calls a action such as fetching) 
//-> action (like load employee calls the allocated reducer)
//-> reducer
//-> reducer takes in old state, updates it and returns new state
// application state is stored in app.state