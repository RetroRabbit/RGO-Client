import { Token } from '@angular/compiler';
import { Component } from '@angular/core';
import { User } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GetUserProfile } from 'src/app/store/actions/userprofile.actions';
import { UserProfileState } from 'src/app/store/reducers/userprofile.reducer';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent {
  UserProfile$: Observable<User> = this.store.select('user')

  constructor(private store: Store<{ user: UserProfileState }>) { }

  ngOnInit()  {
    this.store.dispatch(GetUserProfile());
  }
}

