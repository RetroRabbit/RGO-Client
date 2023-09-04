import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.interface';
import { API } from '../models/constants/urls.constants';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpClient: HttpClient) { }

  getAllEmployees(): Observable<Employee[]>{
    return this.httpClient.get<Employee[]>(`${API.HttpBaseURL}/employee/employees/get`);
  }

  getAll(): Observable<Employee[]>{
    return this.httpClient.get<Employee[]>(`${API.HttpBaseURL}/employee/getall`);
  }

  addEmployee(newEmployee: any): Observable<any>{
    return this.httpClient.post<any>(`${API.HttpBaseURL}/employee/add`, newEmployee);
  }
}
