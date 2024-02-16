import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';
import { Role } from '../models/role.interface';
import { RoleAccess } from '../models/role-access.interface';
import { RoleAccessLink } from '../models/role-access-link.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {

  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${API.HttpsBaseURL}/role-manager`
    }

  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${this.baseUrl}/roles`);
  }

  getAllRoleAccesses(): Observable<RoleAccess[]> {
    return this.httpClient.get<RoleAccess[]>(`${this.baseUrl}/role-accesses`);
  }

  getAllRoleAccesssLinks(): Observable<RoleAccessLink[]> {
    return this.httpClient.get<RoleAccessLink[]>(`${this.baseUrl}/role-access-links`);
  }

}