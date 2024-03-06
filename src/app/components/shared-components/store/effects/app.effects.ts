import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap } from 'rxjs/operators';
import { Observable } from "rxjs";
import * as LoginActions from '../actions/login-in.actions';

@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions
  ) { }

  GetLogin$ = createEffect(() =>
    this.actions$.pipe(
        ofType(LoginActions.GetLogin),
        exhaustMap(({payload}) => {
            LoginActions.GetLogin({payload})
            return new Observable<any>();
        })
    )
  );

}
