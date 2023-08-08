import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { UserprofileService } from 'src/app/services/userprofile.service';
import * as UserProfile from '../actions/userprofile.actions';

@Injectable()
export class UserProfileEffects {
  constructor(
    private actions$: Actions,
    private userprofileService: UserprofileService, 
  ) {}
  
  getUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProfile.GetUserProfile),
      mergeMap(() =>
      this.userprofileService.GetUserProfile().pipe(
        map(user => UserProfile.GetUserProfileSuccess({userProfile:user})),
        )
      )
    )
  );
}
