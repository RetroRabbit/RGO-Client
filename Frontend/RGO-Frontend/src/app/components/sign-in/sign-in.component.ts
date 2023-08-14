import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GetLogin } from '../../store/actions/events.actions';
import * as Auth0 from '@auth0/auth0-angular';
import { Token } from '../../models/token.interface';
import { firstValueFrom, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
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
  private cookieService: CookieService
  ) {}
  token: string | null = null;
  userEmail: string | null = null;

  ngOnInit(){
    this.token = this.cookieService.get('userToken');
    this.userEmail = this.cookieService.get('userEmail');
  }
  Login() {
    this.cookieService.deleteAll();
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
              this.token = token;
              this.userEmail = tempholder || null;
              this.cookieService.set('userToken', token);
              this.cookieService.set('userEmail', tempholder || '');
              this.cookieService.set('userType', googleID.type);
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
