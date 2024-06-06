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
    private sharedPropprtyAccessService: SharedPropertyAccessService
  ) { }

  ngOnInit() {
  }

  screenWidth: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])

  onResize() {
    this.NgZone.run(() => {
      this.screenWidth = window.innerWidth;
    });
  }

  async Login() {
    try {
      // Wait for the login process to complete
      await firstValueFrom(this.authService.login());
      
      // Now the user is authenticated, retrieve the tokens
      const idToken = await this.authService.getIdToken();
      const accessToken = await this.authService.getAccessToken();
      
      // Use this to get photo url from google
      const userInfo = this.authService.getUserInfo();
      const photoUrl = (await userInfo).picture;

      // Set cookies
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
      const assignedRoleFromAuth0 = decodedAccessToken?.assignedRole || [];
      this.cookieService.set('userType', JSON.stringify(assignedRoleFromAuth0), {
        path: '/',
        secure: true,
        sameSite: 'None'
      });

    // Fetch and set the role types
    const roleByEmailFromDb = await firstValueFrom(this.authService.FetchRoleByEmailFromDb(idToken.email));
    if (roleByEmailFromDb) {
      // Check if the role from the DB matches the role assigned from the token
      if (roleByEmailFromDb[assignedRoleFromAuth0]) {
        this.authAccessService.setRoles(roleByEmailFromDb[assignedRoleFromAuth0]);

        const userData: Token = {
          email: idToken.email,
          token: accessToken,
          roles: this.authAccessService.getRoles(),
        };
        
        this.authAccessService.setEmployeeEmail(idToken.email as string);
        this.navService.refreshEmployee();  
        
        this.authService.store.dispatch(GetLogin({ payload: userData }));
        if(window.innerWidth > 776)
            this.navService.showNavbar = true;
        else {
          this.navService.showSideBar = true;
        }

        this.sharedPropprtyAccessService.setAccessProperties();

        if (this.authAccessService.isTalent()) {
            this.navService.isHris = false;
            this.router.navigateByUrl('/ats-dashboard');
        } else if (
            this.authAccessService.isAdmin() ||
            this.authAccessService.isJourney() ||
            this.authAccessService.isSuperAdmin()
        ) {
            this.navService.isHris = true;
            this.cookieService.set('isHris', String(this.navService.isHris));
            this.router.navigateByUrl('/dashboard');
        } else {
            this.router.navigateByUrl('/profile');
        }

      } 
      else {
        throw new Error("Mismatch between role and permission. Possible token tampering.");
      } 
    }
    else {
      throw new Error('No roles returned.');
    }
    } catch (error) {
      window.alert("Login failed.");
      console.error("Login failed:", error);
    }
  }

}