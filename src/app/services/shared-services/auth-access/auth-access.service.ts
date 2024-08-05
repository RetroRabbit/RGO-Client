import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../services/shared-services/auth-access/auth.service';
import { AppState } from 'src/app/components/shared-components/store/app.state';
import { selectToken } from 'src/app/components/shared-components/store/selector/sign-in.selector';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthAccessService {
  public constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private cookieService: CookieService
  )
  {}

  private userId: number = -1;

  getEmployeeEmail(): string {
    let email = "";
    this.store.select(selectToken).subscribe((store) => {
      email = store?.email || '';
    });
    return email;
  }

  getRole() : string {
    let role = "";
    this.store.select(selectToken).subscribe((store) => {
      role = store?.roles || '';
    });
    return role;
  }

  isAdmin() {
    return this.getRole().includes('Admin')
  }

  isSuperAdmin() {
    return this.getRole().includes('SuperAdmin');
  }

  isTalent() {
    return this.getRole().includes('Talent');
  }

  isJourney() {
    return this.getRole().includes('Journey');
  }

  isEmployee() {
    return this.getRole().includes('Employee');
  }

  isSupport() {
    return this.isAdmin() ||
    this.isSuperAdmin() ||
    this.isJourney() ||
    this.isTalent()
  }

  setUserId(Id: number) {
    this.userId = Id;
  }

  getUserId(): number {
    return this.userId;
  }

  clearUserData() {
    this.userId = -1;
    this.cookieService.deleteAll();
  }

  hasSignedIn(): boolean 
  {
    return this.getEmployeeEmail() != "";
  }

  logout(){
    this.clearUserData();
    this.authService.logout();
  }
}