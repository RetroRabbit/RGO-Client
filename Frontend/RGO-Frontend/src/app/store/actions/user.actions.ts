import { createAction, props } from "@ngrx/store";
import { User } from "src/app/models/user.interface";

export const getAllUsers = createAction(
    '[User] Get All Users'
)

export const getAllUsersSuccess = createAction(
    '[AllUsers] Get All Users',
    props<{AllUsers : User[]}>()
)