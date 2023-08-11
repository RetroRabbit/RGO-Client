import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserstacksService } from "src/app/services/userstacks.service";
import * as UserstacksActions from "../actions/userstacks.action"
import { map, mergeMap, take, tap } from "rxjs";

@Injectable()
export class UserstacksEffects{
    constructor(
        private actions$: Actions, 
        private userstacksService: UserstacksService
    ) {}

    getUserstacks$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UserstacksActions.GetUserstacks),
      take(1),
      mergeMap(() => this.userstacksService.getUserstacks().pipe(
        take(1),
        map(userstack => UserstacksActions.GetUserstacksSuccess({ userstacks: userstack })),
      ))
    )
  );

    setUserstacks$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UserstacksActions.SetUserstack),
      take(1),
      mergeMap(() => this.userstacksService.setUserstacks().pipe(
        map(userstack => UserstacksActions.SetUserstackSuccess({ userstacks: userstack })),
      ))
    )
  );
}