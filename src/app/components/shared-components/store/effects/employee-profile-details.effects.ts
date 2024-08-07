import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, catchError, map } from 'rxjs/operators';
import { NewEmployeeProfileService } from "src/app/services/hris/employee/newEmployeeprofile.service";
import * as EmployeeProfileDetailsActions from '../actions/employee-profile-details.actions';
import { of } from 'rxjs';

@Injectable()
export class EmployeeProfileDetailsEffects {
  constructor(
    private actions$: Actions,
    private newEmployeeProfileService: NewEmployeeProfileService
  ) {}

  loadEmployeeProfileDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeProfileDetailsActions.LoadEmployeeProfileDetails),
      exhaustMap(() =>
        this.newEmployeeProfileService.getAllEmployeeProfileDetails().pipe(
          map(newEmployeeProfileDetails => EmployeeProfileDetailsActions.LoadEmployeeProfileDetailsSuccess({ payload: newEmployeeProfileDetails })),
          catchError(error => of(EmployeeProfileDetailsActions.LoadEmployeeProfileDetailsFailure({ error })))
        )
      )
    )
  );

  // TODO: load employee by id

  
}