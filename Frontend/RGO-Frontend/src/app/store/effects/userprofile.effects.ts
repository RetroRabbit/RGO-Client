import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { UserProfileService } from 'src/app/services/userprofile.service';
import * as UserProfile from '../actions/userprofile.actions';

@Injectable()
export class UserProfileEffects {
  constructor(
    private actions$: Actions,
    private userProfileService: UserProfileService, 
  ) {}
  
  getUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProfile.GetUserProfile),
      mergeMap(() =>
      this.userProfileService.GetUserProfile().pipe(
        map(user => UserProfile.GetUserProfileSuccess({userProfile:user})),
        )
      )
    )
  );
}
