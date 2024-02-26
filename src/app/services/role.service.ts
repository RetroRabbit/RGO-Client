import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { environment } from '../../environments/environment';
=======
import { environment } from '../../enviroment/environment';
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClient: HttpClient) { }

  getAllRoles(): Observable<Map<string, string[]>> {
<<<<<<< HEAD
    return this.httpClient.get<Map<string, string[]>>(`${environment.HttpsBaseURL}/rolemanage/getall`);
  }

  getRole(role: string): Observable<Map<string, string[]>> {
    return this.httpClient.get<Map<string, string[]>>(`${environment.HttpsBaseURL}/rolemanage/get?role=${encodeURIComponent(role)}`);
  }

  addRole(role: string, permission: any, grouping:string): Observable<any> {
    return this.httpClient.post<any>(`${environment.HttpsBaseURL}/rolemanage/add?role=${encodeURIComponent(role)}&permission=${encodeURIComponent(permission)}&grouping=${encodeURIComponent(grouping)}`, {});
  }

  deleteRole(role: string, permission: string, grouping:string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.HttpsBaseURL}/rolemanage/remove?role=${encodeURIComponent(role)}&permission=${encodeURIComponent(permission)}&grouping=${encodeURIComponent(grouping)}`);
=======
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
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c
  }
}
