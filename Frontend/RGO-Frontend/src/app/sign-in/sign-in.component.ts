import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { take } from 'rxjs';
import { Users } from '../models/user.interface';
// import { UserService } from '../services/user.services';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  constructor(
  private auth: AuthService,
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
            this.auth.isAuthenticated$
              .pipe(take(1))
              .subscribe((isAuthenticated) => {
                if (isAuthenticated) {
                  this.router.navigateByUrl('home');
                  tempholder = user?.sub?.replace('google-oauth2|', '');
                  var googleID: Users = {
                    GoogleId: tempholder,
                  };
                  // this.userService.saveUser(googleID).subscribe((x) => {});
                }
              });
          });
        },
        error: () => {},
      });
  }
 }
