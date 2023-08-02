import { Component } from '@angular/core';
import { Token } from 'src/app/models/token.interface';
import { Store } from '@ngrx/store';
import { GetUserProfile } from 'src/app/store/actions/userprofile.actions';
import { UserProfile } from 'src/app/models/userprofile.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  GetUserProfile: UserProfile | null = null; // Initialize to null

  constructor(private store: Store<{ app: Token }>, private userStore: Store<{ user: UserProfile }>) {}

  ngOnInit() {
    this.store.select("app").subscribe((state: Token) => {
      this.store.dispatch(GetUserProfile({ email: state.email, token: state.token }));
    });

    this.userStore.select("user").subscribe((state: UserProfile) => {
      console.log(state);
      this.GetUserProfile = state;
    });
  }
}