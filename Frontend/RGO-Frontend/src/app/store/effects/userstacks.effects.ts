import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserstacksService } from "src/app/services/userstacks.service";
import * as UserstacksActions from "../actions/userstacks.action"
import { map, mergeMap } from "rxjs";
import { User } from "@auth0/auth0-angular";

@Injectable()
export class UserstacksEffects{
    constructor(
        private actions$: Actions, 
        private userstacksService: UserstacksService
    ) {}

   getUserstacks$ = createEffect(( () => this.actions$.pipe(
        ofType(UserstacksActions.GetUserstacks),
        mergeMap(() => this.userstacksService.getUserstacks().pipe(
            map(userstack => UserstacksActions.GetUserstacksSuccess({userstacks: userstack}))
        ))
    )
        ) 

    );
    // getUserstacks$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(UserstacksActions.GetUserstacks),
    //         mergeMap(({ email, token }) => {
    //             console.log('Fetching user stacks with email:', email);
    //             return this.userstacksService.getUserstacks(email, token).pipe(
    //                 map(userstack => UserstacksActions.GetUserstacksSuccess({ userstacks: userstack }))
    //             );
    //         })
    //     )
    // );
}