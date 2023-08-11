import { Component } from '@angular/core';
import { GetEvents } from '../../store/actions/events.actions';
import { Store } from '@ngrx/store';
import { EventState } from '../../store/reducers/events.reducer';
import { Events } from '../../models/events.interface';
import { Token } from '../../models/token.interface';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {

  events: Events[] = [];

  constructor(private store: Store<{event : EventState}>,private appStore: Store<{app : Token}>){}

  ngOnInit(){
    this.store.dispatch(GetEvents());
    this.store.select('event').subscribe(state => {
      this.events = state.events;
    });
  }
}
