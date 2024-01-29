import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.interface';
import { EmployeeProfile } from '../../models/employee-profile.interface';
import { API } from '../../models/constants/urls.constants';
import { AuthAccessService } from '../auth-access.service';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpClient: HttpClient,
    private authAccessService: AuthAccessService) { }

  getAllEmployees(): Observable<Employee[]>{
    return this.httpClient.get<Employee[]>(`${API.HttpsBaseURL}/employee/employees`);
  }

  getAll(): Observable<Employee[]>{
    return this.httpClient.get<Employee[]>(`${API.HttpsBaseURL}/employee/employees`);
  }

  getAllProfiles(): Observable<EmployeeProfile[]>{
    return this.httpClient.get<EmployeeProfile[]>(`${API.HttpsBaseURL}/employee/employees`);
  }

  addEmployee(newEmployee: any): Observable<any>{
    return this.httpClient.post<any>(`${API.HttpsBaseURL}/employee/add`, newEmployee);
  }

  get(email: string): Observable<EmployeeProfile> {
    return this.httpClient.get<EmployeeProfile>(`${API.HttpsBaseURL}/employee/get?email=${encodeURIComponent(email)}`);
  }

  updateEmployee(employee: any): Observable<any>{
    const queryParams = `?userEmail=${this.authAccessService.getEmployeeEmail()}`
    return this.httpClient.put<any>(`${API.HttpsBaseURL}/employee/update/${queryParams}`, employee)
  }

  filterEmployeesByType(type: string): Observable<EmployeeProfile[]> {
    return this.httpClient.get<EmployeeProfile[]>(`${API.HttpsBaseURL}/employee/employees/filterbytype?type=${encodeURIComponent(type)}`)
  }
}
