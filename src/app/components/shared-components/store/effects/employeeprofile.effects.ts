// effects/employee-profile.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EmployeeProfileNew } from 'src/app/models/hris/EmployeeProfile/employeeProfileNew.interface';
import * as EmployeeProfileActions from '../actions/employee-profile.actions';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';

@Injectable()
export class EmployeeProfileEffects {
  // loadEmployeeProfiles$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(EmployeeProfileActions.loadEmployeeProfiles),
  //     mergeMap(() =>
  //       this.employeeService.getAll().pipe(
  //         map((employeeProfiles) =>
  //           EmployeeProfileActions.loadEmployeeProfilesSuccess({ employeeProfiles })
  //         ),
  //         catchError((error) => of(EmployeeProfileActions.loadEmployeeProfilesFailure({ error })))
  //       )
  //     )
  //   )
  // );

  // constructor(
  //   private actions$: Actions,
  //   private employeeService: EmployeeService
  // ) {}
}
