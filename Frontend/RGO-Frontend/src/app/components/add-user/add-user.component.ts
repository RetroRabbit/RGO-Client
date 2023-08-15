import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GradGroups } from 'src/app/models/gradgroup.interface';
import { UserService } from 'src/app/services/user.service';
import { UserState } from 'src/app/store/reducers/user.reducer';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  constructor(private store: Store<{ user: UserState }>, private userService: UserService){}

  public gradGroups: GradGroups[] =[{id: 1, title: "2023"}];
  public statuses: any[] =[{id: 1, title: "Active"}];

  newUserForm = new FormGroup({
    gradGroupId: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    joinDate: new FormControl('', Validators.required),
  });


  onSubmit(){
    this.userService.addUser(this.newUserForm.value).subscribe({
      next: (data) => {
      },
      error: (error) => {
      }
    })
  }
}
