import { Component } from '@angular/core';
import { GetEvents } from '../store/actions/app.actions';
import { Store } from '@ngrx/store';
import { EventState } from '../store/reducers/events.reducer';
import { Events } from '../models/events.interface';
import { Token } from '../models/token.interface';
import { state } from '@angular/animations';

@Component({
  selector: 'app-grad-todo',
  templateUrl: './grad-todo.component.html',
  styleUrls: ['./grad-todo.component.css']
})
export class GradTodoComponent {
    events: Events[] = [];

    constructor(private store: Store<{event : EventState}>,private appStore: Store<{app : Token}>){}

    ngOnInit(){
      this.appStore.select('app').subscribe( state => {
        console.log(state.token);
        this.store.dispatch(GetEvents({token: state.token}));
      });
      
      this.store.select('event').subscribe(state => {
        this.events = state.events;
        console.log(state.events);
      });
    }

}
