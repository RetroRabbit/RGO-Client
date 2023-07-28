import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import { EMPTY, Observable } from "rxjs";
import { UserprofileService } from "src/app/services/userprofile.service";
import * as UserProfile from '../actions/userprofile.actions';

@Injectable()
export class UserProfileEffects{
  constructor(
    private actions$: Actions,
    private userprofileService: UserprofileService,
  ) { }

  GetLogin$ = createEffect(() =>
    this.actions$.pipe(
        ofType(UserProfile.GetUserProfile),
        mergeMap(({token}) => {
          this.userprofileService.GetUserProfile({token})
            return new Observable<any>();
        })
    )
  );

}
