import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import { EMPTY, Observable } from "rxjs";
import * as LoginActions from '../actions/app.actions';

@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions
  ) { }

  GetLogin$ = createEffect(() =>
    this.actions$.pipe(
        ofType(LoginActions.GetLogin),
        mergeMap(({payload}) => {
            LoginActions.GetLogin({payload})
            return new Observable<any>();
        })
    )
  );

}
