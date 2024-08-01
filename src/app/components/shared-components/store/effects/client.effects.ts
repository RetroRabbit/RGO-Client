import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, catchError, map } from 'rxjs/operators';
import { ClientService } from "src/app/services/hris/client.service";
import * as ClientActions from '../actions/client.actions';
import { of } from 'rxjs';

@Injectable()
export class ClientEffects {
  constructor(
    private actions$: Actions,
    private clientService: ClientService
  ) {}

  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.LoadClients),
      exhaustMap(() =>
        this.clientService.getAllClients().pipe(
          map(clients => ClientActions.LoadClientsSuccess({ payload: clients })),
          catchError(error => of(ClientActions.LoadClientsFailure({ error })))
        )
      )
    )
  );
}
