// effects/employee-profile.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EmployeeProfileNew } from 'src/app/models/hris/EmployeeProfile/employeeProfileNew.interface';
import * as EmployeeProfileActions from '../actions/employee-profile.actions';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { AuthService } from 'src/app/services/shared-services/auth-access/auth.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';



@Injectable()
export class EmployeeProfileEffects {
  constructor(
    private actions$: Actions,
    private employeeService: EmployeeProfileService,
    private authService : AuthService,
    private navService : NavService
  ) {}

  loadEmployeeProfiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeProfileActions.loadEmployeeProfiles),
      mergeMap(() =>
        this.employeeService.getNEWEmployeeById(15).pipe(
          map((employeeProfile) =>
            EmployeeProfileActions.loadEmployeeProfilesSuccess({ employeeProfile })
          ),
          catchError((error) => of(EmployeeProfileActions.loadEmployeeProfilesFailure({ error })))
        )
      )
    )
  );
}

// effect(the logic which calls a action such as fetching) 
//-> action (like load employee calls the allocated reducer)
//-> reducer
//-> reducer takes in old state, updates it and returns new state
// application state is stored in app.state