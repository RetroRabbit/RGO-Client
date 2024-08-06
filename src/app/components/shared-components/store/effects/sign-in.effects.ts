import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap } from 'rxjs/operators';
import { AuthService } from "src/app/services/shared-services/auth-access/auth.service";
import * as LoginActions from '../actions/sign-in.actions';

@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}

  GetLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.SetToken),
      exhaustMap(({ payload }) => 
        this.authService.getAccessToken().then((accessToken: string) => {
          return LoginActions.LoadTokenSuccess({ payload: accessToken });
        }).catch((error) => {
          return LoginActions.LoadTokenFailure({ error });
        })
      )
    )
  );
}
