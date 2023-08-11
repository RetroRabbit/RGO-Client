import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.interface';
import { WorkshopService } from 'src/app/services/workshop.service';
import { getAllUsers, getSelectedUser } from 'src/app/store/actions/user.actions';
import { UserState } from 'src/app/store/reducers/user.reducer';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();
  allUsers$ = this.store.select('users');
  
  constructor(private store : Store<{users : UserState}>, public service: WorkshopService){}

  ngOnInit(): void {
    this.store.dispatch(getAllUsers());
  }

  manageUser(index: number, users: User[]){
    this.store.dispatch(getSelectedUser({index: index,users: users}));
    this.service.CaptureEvent('User Profile',this.selectedItem);
  }

}
