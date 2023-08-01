import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { EventsService } from 'src/app/services/events.service';
import * as EventsActions from '../actions/events.actions';

@Injectable()
export class EventsEffects {
  constructor(
    private actions$: Actions,
    private eventsService: EventsService
  ) { }
  getEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.GetEvents),
      mergeMap(({token}) =>
        this.eventsService.getAllEvents(token).pipe(
          map(event => EventsActions.GetEventsSuccess({events: event})),
        )
      )
    )
  );
}