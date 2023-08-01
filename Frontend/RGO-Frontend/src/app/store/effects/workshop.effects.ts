import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { WorkshopService } from 'src/app/services/workshop.service';
import * as WorkshopActions from '../actions/workshop.actions';

@Injectable()
export class WorkshopEffects {
  constructor(
    private actions$: Actions,
    private workshopService: WorkshopService
  ) { }
  getWorkshop$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkshopActions.getAllWorkshops),
      mergeMap(({token}) =>
        this.workshopService.getAllWorkshops(token).pipe(
          map(workshop => WorkshopActions.getAllWorkshopSuccess({AllWorkshops: workshop})),
        )
      )
    )
  );
}