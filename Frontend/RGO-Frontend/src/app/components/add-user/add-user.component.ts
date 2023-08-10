import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createUser } from 'src/app/store/actions/user.action';
import { UserState } from 'src/app/store/reducers/user.reducer';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  constructor(private store: Store<{ user: UserState }>){}

  newUserForm = new FormGroup({
    group: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  // onSubmit(){
  //   this.store.dispatch(createUser(this.newUserForm));
  // }



}
