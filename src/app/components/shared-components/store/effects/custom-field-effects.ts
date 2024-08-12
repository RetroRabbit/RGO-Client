import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, catchError, map } from 'rxjs/operators';
import { CustomFieldService } from "src/app/services/hris/field-code.service";
import * as CustomFieldActions from '../actions/custom-field.actions';
import { of } from 'rxjs';

@Injectable()
export class CustomFieldEffects {
  constructor(
    private actions$: Actions,
    private customFieldService: CustomFieldService
  ) {}

  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomFieldActions.LoadCustomField),
      exhaustMap(() =>
        this.customFieldService.getAllFieldCodes().pipe(
          map(customField => CustomFieldActions.LoadCustomFieldSuccess({ payload: customField })),
          catchError(error => of(CustomFieldActions.LoadCustomFieldFailure({ error })))
        )
      )
    )
  );
}
