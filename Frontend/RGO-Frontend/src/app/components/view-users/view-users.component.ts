import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAllUsers } from 'src/app/store/actions/user.actions';
import { UserState } from 'src/app/store/reducers/user.reducer';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  allUsers$ = this.store.select('users');
  constructor(private store : Store<{users : UserState}>){}

  ngOnInit(): void {
    this.store.dispatch(getAllUsers());
  }

}
