import { Component } from '@angular/core';
import { Token } from 'src/app/models/token.interface';
import { Store } from '@ngrx/store';
import { GetUserProfile } from 'src/app/store/actions/userprofile.actions';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  constructor(private store: Store<{app: Token}>,) {}

  ngOnInit() {
    this.store.select("app").subscribe(
      state => {
        this.store.dispatch(GetUserProfile({email: state.email, token: state.token}));
      });

  }

}

