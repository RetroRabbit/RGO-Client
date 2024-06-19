import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthAccessService {
  public constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
  )
  { 
    this.baseUrl = `${environment.HttpsBaseURL}/auth`
  }
  baseUrl: string;

  private roles: string = '';

  private employeeEmail: string = '';

  private userId: number = -1;

  RemoveUserRole(employeeId : string, roleId : string){
    return this.httpClient.put<string>(
      `${environment.HttpsBaseURL}/userId=${employeeId}`,roleId);
  }

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
