import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap } from 'rxjs/operators';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import * as EmployeeProfile from '../actions/employee-profile.actions';

@Injectable()
export class EmployeeProfileEffects {
  constructor(
    private actions$: Actions,
    private employeeProfileService: EmployeeProfileService,
  ) { }

  // getEmployeeProfile$ = createEffect(() =>
  //   this.actions$.pipe(
      // ofType(EmployeeProfile.GetEmployeeProfile),
      // exhaustMap(() =>
        // this.employeeProfileService.GetEmployeeProfile().pipe(
        //   map(employee => EmployeeProfile.GetEmployeeProfileSuccess({ employeeProfile: employee })),
        // )
  //     )
  //   )
  // );

  // updateEmployeeProfile$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(EmployeeProfile.UpdateEmployeeProfile),
  //     exhaustMap((UpdatedProfile: any) =>
  //       this.employeeProfileService.UpdateEmployeeProfile(UpdatedProfile).pipe(
  //         map(response => EmployeeProfile.UpdateEmployeeProfileSuccess({ response })),
  //       )
  //     )
  //   )
  // );
  
}
