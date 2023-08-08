import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AdminService } from "src/app/services/admin.service";
import { getAllUsers, getAllUsersSuccess } from "../actions/admin.actions";
import { map, mergeMap } from "rxjs";

@Injectable()
export class AdminEffects{
    constructor(private actions$ : Actions, private adminService : AdminService){}
    
    getUsers$ = createEffect( () =>
        this.actions$.pipe(
            ofType(getAllUsers),
            mergeMap(()=>
                this.adminService.getAllUsers().pipe(
                    map(users => getAllUsersSuccess({AllUsers : users}))
                )
            )
        )
    );
}