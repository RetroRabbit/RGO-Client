import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRoleService {

  constructor(private httpClient: HttpClient) { }

  getAllRoles(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${API.HttpBaseURL}/employeerolemanager/get-all`);
  }

  getRoles(email: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${API.HttpBaseURL}/employeerolemanager/get?email=${encodeURIComponent(email)}`);
  }

  addRole(email: string, role: string): Observable<any> {
    return this.httpClient.post<any>(`${API.HttpBaseURL}/employeerolemanager/add?email=${encodeURIComponent(email)}&newRole=${encodeURIComponent(role)}`, {});
  }

  removeRole(email: string, role: string): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/employeerolemanager/remove?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
  }
}
