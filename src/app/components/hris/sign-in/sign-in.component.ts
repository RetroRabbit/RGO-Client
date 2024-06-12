import { Component, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { GetLogin } from '../../shared-components/store/actions/login-in.actions';
import { Token } from '../../../models/hris/token.interface';
import { AuthService } from '../../../services/shared-services/auth-access/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { AppComponent } from 'src/app/app.component';

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
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    public navService: NavService,
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

  async Login() {
    try {    
      const isBackendConnected = await this.authService.checkBackendConnection();
      if (!isBackendConnected) {
        window.alert("Backend is not available.");
        return;
      }

      await firstValueFrom(this.authService.login());
      
      const idToken = await this.authService.getIdToken();
      const accessToken = await this.authService.getAccessToken();

      // Use this to get photo url from google
      const photoUrl = idToken.picture;

      this.cookieService.set('userEmail', idToken.email || '', {
        path: '/',
        secure: true,
        sameSite: 'None'
      });

      this.cookieService.set('accessToken', accessToken || '', {
        path: '/',
        secure: true,
        sameSite: 'None'
      });

      const decodedAccessToken = this.authService.decodeJwt(accessToken);
      const assignedRoleFromAuth0 = decodedAccessToken?.role || [];
      const validRoles = ['SuperAdmin', 'Employee', 'Talent', 'Journey', 'Admin'];
      const filteredRoles = assignedRoleFromAuth0.filter((role: string) => validRoles.includes(role));

      if (filteredRoles.length > 0) {

        this.cookieService.set('userType', JSON.stringify(assignedRoleFromAuth0), {
          path: '/',
          secure: true,
          sameSite: 'None'
        });

        this.authAccessService.setRoles(assignedRoleFromAuth0);

        const userData: Token = {
          email: idToken.email,
          token: accessToken,
          roles: assignedRoleFromAuth0,
        };

        this.authAccessService.setEmployeeEmail(idToken.email as string);
        this.navService.refreshEmployee();

        this.authService.store.dispatch(GetLogin({ payload: userData }));
        if (window.innerWidth > 776)
          this.navService.showNavbar = true;
        else {
          this.navService.showSideBar = true;
        }

        this.sharedPropprtyAccessService.setAccessProperties();
        this.initialUserNavigation();
      }
      else {
        console.error("Login failed: User has invalid or no role assigned.");
        window.alert("Login failed. User has invalid or no role assigned.");
      }
    } catch (error) {
      window.alert("Login failed.");
      console.error("Login failed:", error);
    }
  }

  initialUserNavigation(){
    // TODO: put back in once ATS is available
    // if (this.authAccessService.isTalent()) {
    // this.navService.isHris = false;
    // this.router.navigateByUrl('/ats-dashboard');
    // } else if (
      if (
        this.authAccessService.isAdmin() ||
        this.authAccessService.isJourney() ||
        this.authAccessService.isSuperAdmin() ||
        this.authAccessService.isTalent()
      ) {
        this.navService.isHris = true;
        this.cookieService.set('isHris', String(this.navService.isHris));
        this.router.navigateByUrl('/dashboard');
      } else if (this.authAccessService.isEmployee()) {
        this.router.navigateByUrl('/profile');
      } else {
        this.router.navigate(['/login']);
      }

    }
  }