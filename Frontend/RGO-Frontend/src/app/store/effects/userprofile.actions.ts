import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import { EMPTY, Observable } from "rxjs";
import * as UserProfile from '../actions/userprofile.actions';

@Injectable()
export class UserProfileEffects{
  constructor(
    private actions$: Actions
  ) { }

  GetLogin$ = createEffect(() =>
    this.actions$.pipe(
        ofType(UserProfile.GetUserProfile),
        mergeMap(({user}) => {
          UserProfile.GetUserProfile({user})
            return new Observable<any>();
        })
    )
  );

}
