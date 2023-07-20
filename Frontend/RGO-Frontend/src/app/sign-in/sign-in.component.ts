import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GetLogin } from '../store/app.actions';
import * as Auth0 from '@auth0/auth0-angular';
import { Token } from '../models/token.interface';
import { take } from 'rxjs';
import { AuthService } from '../services/auth.service';
// import { UserService } from '../services/user.services';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  user: Token | undefined;

  constructor(
  private store: Store<Auth0.AppState>,
  private auth: Auth0.AuthService,
  private authService: AuthService,
  private router: Router,
  // private userService: UserService // saving the user
  ) {}

  Login() {
    var tempholder;
    this.auth
      .loginWithPopup()
      .pipe(take(1))
      .subscribe({
        next: () => {
          
          this.auth.user$.pipe(take(1)).subscribe((user) => {
            this.authService.login(user?.email)
            .subscribe(res => {
              
              tempholder = user?.sub?.replace('google-oauth2|', '');
              var googleID: Token = {
                GoogleId: tempholder,
              };

              this.store.dispatch(GetLogin({ payload: googleID }));
              this.router.navigateByUrl('/home');
            });
 
          });
        },
        error: () => {},
      });
  }
 }
