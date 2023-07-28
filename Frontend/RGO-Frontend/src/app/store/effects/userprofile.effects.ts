import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { UserprofileService } from 'src/app/services/userprofile.service';
import * as UserProfile from '../actions/userprofile.actions';
import { Token } from '@angular/compiler';

@Injectable()
export class UserProfileEffects {
  constructor(
    private actions$: Actions,
    private userprofileService: UserprofileService,
    private token: Token
  ) {}

  getUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProfile.GetUserProfile),
      mergeMap(({ email, token }) =>
      this.userprofileService.GetUserProfile(email, token).pipe(
        map(user => UserProfile.GetUserProfileSuccess({user: user})),
        )
      )
    )
  );
}
