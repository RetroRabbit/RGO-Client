import { Component, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GetLogin } from '../../../store/actions/login-in.actions';
import * as Auth0 from '@auth0/auth0-angular';
import { Token } from '../../../models/token.interface';
import { map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { NavService } from 'src/app/services/nav.service';
import { AuthAccessService } from 'src/app/services/auth-access.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  user: Token | undefined;
  token: string | null = null;
  userEmail: string | null = null;

  constructor(
    private store: Store<Auth0.AppState>,
    private auth: Auth0.AuthService,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    public navService: NavService,
    private authAccessService: AuthAccessService,
    private NgZone: NgZone
  ) {}

  ngOnInit() {
    this.token = this.cookieService.get('userToken');
    this.userEmail = this.cookieService.get('userEmail');
  }

  screenWidth: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])

  onResize() {
    this.NgZone.run(() => {
      this.screenWidth = window.innerWidth;
      this.checkIfMobile();
    });
  }

  private checkIfMobile() {
    this.screenWidth = window.innerWidth;
  }

  Login() {
    this.cookieService.deleteAll();
    this.auth
      .loginWithPopup()
      .pipe(
        take(1),
        switchMap(() => this.auth.user$.pipe(take(1))),
        switchMap((user) => {
          this.cookieService.set('userEmail', user?.email || '');
          return this.authService.login(user?.email).pipe(
            tap((token) => this.cookieService.set('userToken', token)),
            map((token) => ({ user, token }))
          );
        }),
        switchMap(({ user, token }) =>
          this.authService.FetchRoles(user?.email).pipe(
            tap((roles) => this.cookieService.set('userType', roles)),
            map((roles) => ({ user, token, roles }))
          )
        )
      )
      .subscribe({
        next: ({ user, token, roles }) => {
          this.authAccessService.setRoles(roles);
          const googleID: Token = {
            email: user?.email,
            token: token,
            roles: roles,
          };
          this.authAccessService.setEmployeeEmail(user?.email as string);
          this.store.dispatch(GetLogin({ payload: googleID }));
          this.navService.showNavbar = true;
          if(
            this.authAccessService.isTalent()
          ) {this.navService.isHris = false; this.router.navigateByUrl('/ats-dashboard'); }
          if (
            this.authAccessService.isAdmin() ||
            this.authAccessService.isJourney() ||
            this.authAccessService.isSuperAdmin()
          ) {
            this.router.navigateByUrl('/dashboard');
          }
          else if(this.authAccessService.isEmployee()){this.router.navigateByUrl('/profile');}
        },
      });
  }
}