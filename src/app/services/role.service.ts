import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClient: HttpClient) { }

  getAllRoles(): Observable<Map<string, string[]>> {
    return this.httpClient.get<Map<string, string[]>>(`${API.HttpsBaseURL}/rolemanage/getall`);
  }

  getRole(role: string): Observable<Map<string, string[]>> {
    return this.httpClient.get<Map<string, string[]>>(`${API.HttpsBaseURL}/rolemanage/get?role=${encodeURIComponent(role)}`);
  }

  addRole(role: string, permission: any): Observable<any> {
    return this.httpClient.post<any>(`${API.HttpsBaseURL}/rolemanage/add?role=${encodeURIComponent(role)}&permission=${encodeURIComponent(permission)}`, {});
  }

  deleteRole(role: string, permission: string): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpsBaseURL}/rolemanage/remove?role=${encodeURIComponent(role)}&permission=${encodeURIComponent(permission)}`);
  }
}
