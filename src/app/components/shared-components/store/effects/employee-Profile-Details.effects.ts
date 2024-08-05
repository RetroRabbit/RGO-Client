// effects/employee-profile.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';;
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';


@Injectable()
export class EmployeeProfileDetailsEffects {
  constructor(
    private actions$: Actions,
    private employeeService: EmployeeProfileService
  ) {}

}


// effect(the logic which calls a action such as fetching) 
//-> action (like load employee calls the allocated reducer)
//-> reducer
//-> reducer takes in old state, updates it and returns new state
// application state is stored in app.state