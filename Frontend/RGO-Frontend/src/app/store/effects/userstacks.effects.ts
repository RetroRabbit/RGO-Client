import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserstacksService } from "src/app/services/userstacks.service";
import * as UserstacksActions from "../actions/userstacks.action"
import { exhaustMap, map, take } from "rxjs/operators";

@Injectable()
export class UserstacksEffects{
    constructor(
        private actions$: Actions, 
        private userstacksService: UserstacksService
    ) {}

    getUserstacks$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UserstacksActions.GetUserstacks),
      exhaustMap(() => this.userstacksService.getUserstacks().pipe(
        map(userstack => UserstacksActions.GetUserstacksSuccess({ userstacks: userstack })),
      ))
    )
  );

    setUserstacks$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UserstacksActions.SetUserstack),
      exhaustMap(() => this.userstacksService.setUserstacks().pipe(
        map(userstack => UserstacksActions.SetUserstackSuccess({ userstacks: userstack })),
      ))
    )
  );

  updateUserstacks$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UserstacksActions.UpdateUserstack),
      take(1),
      exhaustMap(({userstacks}) => this.userstacksService.updateUserstacks(userstacks).pipe(
        map(userstack => UserstacksActions.UpdateUserstackSuccess({ userstacks: userstack })),
      ))
    )
  );
}