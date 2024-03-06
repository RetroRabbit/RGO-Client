import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClient: HttpClient) { }

  getAllRoles(): Observable<Map<string, string[]>> {
    return this.httpClient.get<Map<string, string[]>>(`${environment.HttpsBaseURL}/role-manager`);
  }

  getRole(role: string): Observable<Map<string, string[]>> {
    return this.httpClient.get<Map<string, string[]>>(`${environment.HttpsBaseURL}/role-manager/get?role=${encodeURIComponent(role)}`);
  }

  addRole(role: string, permission: any, grouping:string): Observable<any> {
    return this.httpClient.post<any>(`${environment.HttpsBaseURL}/role-manager?role=${encodeURIComponent(role)}&permission=${encodeURIComponent(permission)}&grouping=${encodeURIComponent(grouping)}`, {});
  }

  deleteRole(role: string, permission: string, grouping:string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.HttpsBaseURL}/role-manager?role=${encodeURIComponent(role)}&permission=${encodeURIComponent(permission)}&grouping=${encodeURIComponent(grouping)}`);
  }
}
