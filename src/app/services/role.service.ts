import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClient: HttpClient) { }

  getAllRoles(): Observable<Map<string, string[]>> {
    return this.httpClient.get<Map<string, string[]>>(`${environment.Https_Base_URL}/rolemanage/getall`);
  }

  getRole(role: string): Observable<Map<string, string[]>> {
    return this.httpClient.get<Map<string, string[]>>(`${environment.Https_Base_URL}/rolemanage/get?role=${encodeURIComponent(role)}`);
  }

  addRole(role: string, permission: any, grouping:string): Observable<any> {
    return this.httpClient.post<any>(`${environment.Https_Base_URL}/rolemanage/add?role=${encodeURIComponent(role)}&permission=${encodeURIComponent(permission)}&grouping=${encodeURIComponent(grouping)}`, {});
  }

  deleteRole(role: string, permission: string, grouping:string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.Https_Base_URL}/rolemanage/remove?role=${encodeURIComponent(role)}&permission=${encodeURIComponent(permission)}&grouping=${encodeURIComponent(grouping)}`);
  }
}
