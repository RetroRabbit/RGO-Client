import { Component, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SetToken } from '../../shared-components/store/actions/sign-in.actions';
import * as Auth0 from '@auth0/auth0-angular';
import { Token } from '../../../models/hris/token.interface';
import { EMPTY, catchError, of, switchMap, take } from 'rxjs';
import { AuthService } from '../../../services/shared-services/auth-access/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { AppState } from '../../shared-components/store/app.state';
import { selectToken } from '../../shared-components/store/selector/sign-in.selector';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  user: Token | undefined;
  userEmail: string | null = null;

  constructor(
    private store: Store<AppState>,
    private auth: Auth0.AuthService,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    public navService: NavService,
    private snackBarService: SnackbarService,
    private authAccessService: AuthAccessService,
    private NgZone: NgZone,
    public sharedPropertyAccessService: SharedPropertyAccessService,
  ) { }

  ngOnInit() {
    if(this.authAccessService.hasSignedIn()){
      this.initialUserNavigation();
      return
    }

    let token: string;
    this.store.select(selectToken).subscribe((storeToken) => {
      token = storeToken?.token || '';
      if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expiryDate = new Date(tokenPayload.exp * 1000);
        if (expiryDate < new Date()) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  screenWidth: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])

  onResize() {
    this.NgZone.run(() => {
      this.screenWidth = window.innerWidth;
    });
  }

  @HostListener('window:popstate', ['$event'])

  onPopState() {
      location.reload()
  }

  Login() {
    const validRoles = ['SuperAdmin', 'Employee', 'Talent', 'Journey', 'Admin'];
    this.cookieService.deleteAll();
    this.authService.checkConnection()
      .pipe(
        switchMap(() => this.auth.loginWithPopup()),
        take(1),
        switchMap(() => this.auth.user$.pipe(take(1))),
        switchMap((user) =>
          this.auth.getAccessTokenSilently().pipe(
            switchMap((token) => {
              const decodedToken = this.authService.decodeJwt(token);
              const role = decodedToken.role || [];
              const filteredRoles = role.filter((role: string) => validRoles.includes(role));

              const userData: Token = {
                email: decodedToken.email,
                token: token,
                roles: role,
              };
              this.store.dispatch(SetToken({ payload: userData }));
  
              return this.authService.checkUserExistenceInDatabase().pipe(
                switchMap(response => {
                  if (response === 'User found.') {
                    if (filteredRoles.length > 0) {
                      return of({ user, token, role: filteredRoles });
                    } else {
                      this.snackBarService.showSnackbar("Account Finalizing. Now entering...", "snack-success");
                      setTimeout(() => this.Login(), 1000);
                      return EMPTY;
                    }
                  } else {
                    this.snackBarService.showSnackbar("Contact Admin Regarding Your Account.", "snack-error");
                    location.reload();
                    return EMPTY;
                  }
                }),
                catchError(() => {
                  this.snackBarService.showSnackbar("Contact Admin Regarding Your Account.", "snack-error");
                  location.reload();
                  return EMPTY;
                })
              );
            })
          )
        )
      )
      .subscribe({
        next: ({ user, token, role }) => {
          if (user && token && role) {
            if (window.innerWidth > 776)
              this.navService.showNavbar = true;
            else
              this.navService.showSideBar = true;
  
            this.initialUserNavigation();
          }
        },
        error: () => {
          this.snackBarService.showSnackbar("Contact admin regarding your account.","snack-error");
        }
      });
  }  

  initialUserNavigation() {
    if (this.authAccessService.isSupport()) {
      this.router.navigateByUrl('/dashboard');
    }
    else if (this.authAccessService.isEmployee()) {
      this.router.navigateByUrl('/profile');
    }
    else if (this.authAccessService.isTalent()) {
      this.authAccessService.setAccessToAts(true);
      this.router.navigateByUrl('/ats-dashboard');
    }
    else
      this.router.navigateByUrl('/login');
  }
}
