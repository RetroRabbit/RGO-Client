import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user.interface';

export const createUser = createAction('[user] Create User' , props<{ user: User }>());
