import { Component, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GetLogin } from '../../shared-components/store/actions/login-in.actions';
import * as Auth0 from '@auth0/auth0-angular';
import { Token } from '../../../models/hris/token.interface';
import { EMPTY, catchError, of, switchMap, take } from 'rxjs';
import { AuthService } from '../../../services/shared-services/auth-access/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { AppComponent } from 'src/app/app.component';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
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
    private snackBarService: SnackbarService,
    private authAccessService: AuthAccessService,
    private NgZone: NgZone,
    private sharedPropprtyAccessService: SharedPropertyAccessService,
    private appComponent: AppComponent,
  ) { }

  ngOnInit() {
    if(this.appComponent.hasSignedIn()){
      this.initialUserNavigation();
      return
    }
    this.token = this.cookieService.get('accessToken');
    this.userEmail = this.cookieService.get('userEmail');
    
    if (this.token) {
      const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));
      const expiryDate = new Date(tokenPayload.exp * 1000);
  
      if (expiryDate < new Date()) {
        this.cookieService.deleteAll();
        this.router.navigate(['/login']);
      }
    }
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
  
              this.cookieService.set('userEmail', user?.email || '', {
                path: '/',
                secure: true,
                sameSite: 'None'
              });
  
              this.cookieService.set('accessToken', token, {
                path: '/',
                secure: true,
                sameSite: 'None'
              });
  
              this.cookieService.set('userType', JSON.stringify(filteredRoles), {
                path: '/',
                secure: true,
                sameSite: 'None'
              });
  
              return this.authService.checkUserExistenceInDatabase().pipe(
                switchMap(response => {
                  if (response === 'User found.') {
                    if (filteredRoles.length > 0) {
                      return of({ user, token, role: filteredRoles });
                    } else {
                      this.snackBarService.showSnackbar("Account Finalized. You May Now Log in.", "snack-success");
                      return EMPTY;
                    }
                  } else {
                    this.snackBarService.showSnackbar("Contact Admin Regarding Your Account.", "snack-error");
                    return EMPTY;
                  }
                }),
                catchError(() => {
                  this.snackBarService.showSnackbar("Contact Admin Regarding Your Account.", "snack-error");
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
            this.authAccessService.setRoles(role);
            const userData: Token = {
              email: user.email,
              token: token,
              roles: role,
            };
            this.authAccessService.setEmployeeEmail(user.email as string);
            this.navService.refreshEmployee();
            this.store.dispatch(GetLogin({ payload: userData }));
  
            if (window.innerWidth > 776)
              this.navService.showNavbar = true;
            else
              this.navService.showSideBar = true;
  
            this.sharedPropprtyAccessService.setAccessProperties();
            this.initialUserNavigation();
          }
        },
        error: () => {
          this.snackBarService.showSnackbar("Contact admin regarding your account.","snack-error");
        }
      });
  }  


  initialUserNavigation(){
  // TODO: put back in when ats available
          // if (this.authAccessService.isTalent()) {
          //   this.navService.isHris = false;
          //   this.router.navigateByUrl('/ats-dashboard');
          // }
          if (
            this.authAccessService.isAdmin() ||
            this.authAccessService.isJourney() ||
            this.authAccessService.isSuperAdmin() ||
            this.authAccessService.isTalent()
          ) {
            this.navService.isHris = true;
            this.cookieService.set('isHris', String(this.navService.isHris))
            this.router.navigateByUrl('/dashboard');
          }
          else if (this.authAccessService.isEmployee()) { this.router.navigateByUrl('/profile'); }
          else this.router.navigateByUrl('/login');
  }
}
