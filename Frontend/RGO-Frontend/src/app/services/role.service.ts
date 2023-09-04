import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClient: HttpClient) { }

  getAllRoles(): Observable<any>{
    return this.httpClient.get<any>(`${API.HttpBaseURL}/rolemanage/getall`);
  }

  getRole(email: string): Observable<any>{
    return this.httpClient.get<any>(`${API.HttpBaseURL}/rolemanage/get?email=${encodeURIComponent(email)}`);
  }

  addRole(email: string, role: any): Observable<any>{
    return this.httpClient.post<any>(`${API.HttpBaseURL}/rolemanage/add?email=${encodeURIComponent(email)}`, role);
  }

  deleteRole(role: string, access: string): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/rolemanage/delete?role=${encodeURIComponent(role)}&access=${encodeURIComponent(access)}`);
  }
}
