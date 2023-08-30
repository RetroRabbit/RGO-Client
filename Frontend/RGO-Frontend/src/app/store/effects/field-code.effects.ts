import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { FieldCodeService } from '../../services/field-code.service';
import * as FieldCodeActions from '../actions/field-code.actions';

@Injectable()
export class FieldCodeEffects {
    constructor(
        private actions$: Actions,
        private fieldCodeService: FieldCodeService
    ) { }

    addFieldCode$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FieldCodeActions.addFieldCode),
            mergeMap((action) =>
                this.fieldCodeService.addFieldCode(action.fieldCode).pipe(
                    map((response) => {
                        return response;
                    }),
                    catchError((error) => {
                        return error;
                    })
                )
            )
        )
    );

    addFieldCodeOptions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FieldCodeActions.addFieldCodeOptions),
            mergeMap((action) =>
                this.fieldCodeService.addFieldCodeOptions(action.option).pipe(
                    map((response) => {
                        return response;
                    }),
                    catchError((error) => {
                        return error;
                    })
                )
            )
        )
    );
}
