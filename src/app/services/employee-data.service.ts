import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';
import { EmployeeData } from '../models/employee-data.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDataService {

  constructor(private httpClient: HttpClient) { }

  getEmployeeData(employeeId: number): Observable<EmployeeData[]>{
    const queryParams = `?id=${employeeId}`;
    return this.httpClient.get<EmployeeData[]>(`${API.HttpBaseURL}/employeedata/get${queryParams}`);
  }

  updateEmployeeData(employeeData: EmployeeData): Observable<EmployeeData>{
    return this.httpClient.put<EmployeeData>(`${API.HttpBaseURL}/employeedata/update`, employeeData)
  }

  saveEmployeeData(employeeData: any): Observable<EmployeeData>{
    return this.httpClient.post<EmployeeData>(`${API.HttpBaseURL}/employeedata/save`, employeeData)
  }
}
