import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/components/shared-components/store/app.state';
import { selectClients } from 'src/app/components/shared-components/store/selector/client.selector';
import { Client } from 'src/app/models/hris/client.interface';

@Injectable({
  providedIn: 'root',
})
export class StoreAccessService {
  public constructor(
    private store: Store<AppState>,
  )
  {}

  getClients(): Client[] {
    let clients: Client[] = [];
    this.store.select(selectClients).subscribe((store) => {
      clients = store || '';
    });
    return clients;
  }

 
}