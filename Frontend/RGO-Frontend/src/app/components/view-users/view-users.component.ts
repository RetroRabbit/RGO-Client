import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.interface';
// import { WorkshopService } from 'src/app/services/workshop.service';
import { getAllUsers, getSelectedUser } from 'src/app/store/actions/user.actions';
import { UserState } from 'src/app/store/reducers/user.reducer';
import { Table } from 'primeng/table';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  
  allUsers:User[]= [];
  allUsers$ = this.store.select('users');

  constructor(private store : Store<{users : UserState}>, 
    // public service: WorkshopService, 
    private home: HomeComponent){}


  ngOnInit(): void {
    this.store.dispatch(getAllUsers());
    setTimeout(() => {
      this.allUsers$.subscribe(userState => {
        this.allUsers = userState.AllUsers; 
      });
    },500);
    
  }

  clear(table: Table) {
    table.clear();
}

  manageUser(users: User){
    let index =-1;
    for(let i =0; i < this.allUsers.length; i++){
      if(this.allUsers[i].email === users.email)
      {
        index = i;
        break;
      }
    }
    this.store.dispatch(getSelectedUser({index: index,users: this.allUsers}));
    // this.service.CaptureEvent('User Profile');
    this.home.handleSelectedItem();
  }

}
