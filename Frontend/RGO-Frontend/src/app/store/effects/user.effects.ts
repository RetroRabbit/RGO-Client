import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "src/app/services/user.service";
import { getAllUsers, getAllUsersSuccess } from "../actions/user.actions";
import { map, mergeMap } from "rxjs";

@Injectable()
export class UserEffects{
    constructor(private actions$ : Actions, private userService : UserService){}
    
    getUsers$ = createEffect( () =>
        this.actions$.pipe(
            ofType(getAllUsers),
            mergeMap(()=>
                this.userService.getAllUsers().pipe(
                    map(users => getAllUsersSuccess({AllUsers : users}))
                )
            )
        )
    );
}