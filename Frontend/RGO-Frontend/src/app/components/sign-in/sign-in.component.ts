import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GetLogin } from '../../store/actions/app.actions';
import * as Auth0 from '@auth0/auth0-angular';
import { Token } from '../../models/token.interface';
import { firstValueFrom, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
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
  ) {}

  Login() {
    this.auth
      .loginWithPopup()
      .pipe(take(1))
      .subscribe({
        next: () => {

          
          this.auth.user$.pipe(take(1)).subscribe((user) => {
            this.authService.login(user?.email)
            .subscribe(async (res) => {
              
              var tempholder = user!.email;
              var token =  await firstValueFrom(this.auth.getAccessTokenSilently());
              var googleID: Token = {
                email: tempholder,
                token: token,
                type: res
              };

              this.store.dispatch(GetLogin({ payload: googleID }));
              this.router.navigateByUrl('/home');
            });
 
          });
        },
        error: (error) => {
          console.log(typeof error);
        },
      });
  }
 }
