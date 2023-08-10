import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user.service';
import { UserState } from 'src/app/store/reducers/user.reducer';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  constructor(private store: Store<{ user: UserState }>, private userService: UserService){}

  newUser!: User | null;

  newUserForm = new FormGroup({
    gradGroupId: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  onSubmit(){
    this.userService.addUser(this.newUserForm.value).subscribe({
      next: (data: any) => {
        console.log(data);
      }
    }
      
    )
  }



}
