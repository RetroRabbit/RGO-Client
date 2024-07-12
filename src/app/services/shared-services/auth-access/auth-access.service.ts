import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthAccessService {
  public constructor(
    private cookieService: CookieService,
  )
  {}

  private roles: string = '';

  private employeeEmail: string = '';

  private userId: number = -1;

  setEmployeeEmail(email: string) {
    this.employeeEmail = email;
  }

  getEmployeeEmail(): string {
    return this.employeeEmail;
  }

  setRoles(roles: string) {
    this.roles = roles;
  }

  getRoles() {
    return this.roles;
  }

  isAdmin() {
    return this.roles.includes('Admin');
  }

  isSuperAdmin() {
    return this.roles.includes('SuperAdmin');
  }

  isTalent() {
    return this.roles.includes('Talent');
  }

  isJourney() {
    return this.roles.includes('Journey');
  }

  isEmployee() {
    return this.roles.includes('Employee');
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
    this.roles = "";
    this.userId = -1;
    this.employeeEmail = "";
    this.cookieService.deleteAll();
  }
}