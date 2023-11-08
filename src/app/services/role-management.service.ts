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

  constructor(private httpClient: HttpClient) { }

  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${API.HttpsBaseURL}/rolemanage/getallroles`);
  }

  getAllRoleAccesses(): Observable<RoleAccess[]> {
    return this.httpClient.get<RoleAccess[]>(`${API.HttpsBaseURL}/rolemanage/getallroleaccesses`);
  }

  getAllRoleAccesssLinks(): Observable<RoleAccessLink[]> {
    return this.httpClient.get<RoleAccessLink[]>(`${API.HttpsBaseURL}/rolemanage/getallroleaccesslinks`);
  }

}