import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAllUsers } from 'src/app/store/actions/user.actions';
import { UserState } from 'src/app/store/reducers/user.reducer';

@Component({
  selector: 'app-view-users-page',
  templateUrl: './view-users-page.component.html',
  styleUrls: ['./view-users-page.component.css']
})
export class ViewUsersPageComponent implements OnInit {
  allUsers$ = this.store.select('users');
  constructor(private store : Store<{users : UserState}>){}

  ngOnInit(): void {
    this.store.dispatch(getAllUsers());
  }

}
