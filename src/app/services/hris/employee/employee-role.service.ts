import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRoleService {
  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${environment.HttpsBaseURL}/employee-role-manager`
  }
  getAllRoles(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}/all`);
  }

  getRoles(email: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}?email=${encodeURIComponent(email)}`);
  }

  addRole(email: string, role: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`, {});
  }

  removeRole(email: string, role: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
  }

  getEmployeeOnRoles(roleId: number): Observable<any[]>{
    const queryParams = `?roleId=${roleId}`;
    return this.httpClient.get<any[]>(`${this.baseUrl}/get-role${queryParams}`);
  }

  updateRole(email: string, role: string): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`, {});
  }
}
